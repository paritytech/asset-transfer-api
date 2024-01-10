// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

import { AssetTransferApi } from '../../src';
import { TxResult } from '../../src/types';

const createAssetApi = (api: ApiPromise, specName: string, safeXcmVersion: number): AssetTransferApi => {
	const injectedRegistry = {
		rococo: {
			'1836': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'asset-hub-rococo',
				poolPairsInfo: {},
			},
		},
	};

	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion,
		{ injectedRegistry });


	return assetApi;
};

const createLocalTransferTransaction = async (
	origin: KeyringPair,
	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	opts: object,
	api: ApiPromise,
	specName: string,
	safeXcmVersion: number,
) => {
	const assetApi = createAssetApi(api, specName, safeXcmVersion);

	let localTransferInfo: TxResult<'submittable'>;
	try {
		localTransferInfo = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);
		await localTransferInfo.tx.signAndSend(origin);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

const createPayFeesTransaction = async (
	origin: KeyringPair,
	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	opts: {},
	api: ApiPromise,
	specName: string,
	safeXcmVersion: number,
) => {
	const assetApi = createAssetApi(api, specName, safeXcmVersion);

	let localTransferInfo: TxResult<'payload'>;
	try {
		localTransferInfo = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);
		const signature = api.registry
			.createType('ExtrinsicPayload', localTransferInfo, {
				version: 4,
			})
			.sign(origin).signature as unknown as `0x${string}`;

		const extrinsic = api.registry.createType(
			'Extrinsic',
			{ method: localTransferInfo.method },
			{ version: 4 }
		);

		let sender: string;
		if (opts["sendersAddr"] === undefined) {
			sender = ''
		} else {
			sender = opts["sendersAddr"];
		}

		const signed = extrinsic.addSignature(sender, signature, localTransferInfo as unknown as `0x${string}`).toHex()

		await api.rpc.author.submitExtrinsic(signed)

	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

export const liquidPoolsTests: { [K: string]: Function } = { createLocalTransferTransaction, createPayFeesTransaction };
