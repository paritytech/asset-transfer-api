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
		let sender: string;
		if (opts["sendersAddr"] === undefined) {
			sender = ''
		} else {
			sender = opts["sendersAddr"];
		}

		localTransferInfo = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);
		console.log(localTransferInfo.tx)

		const payload = api.createType('ExtrinsicPayload', localTransferInfo.tx, {
			version: 4,
		})

		const message = payload.toU8a({ method: true });

		const signat = origin.sign(message, { withType: true });

		const extrinsic = api.createType(
			'Extrinsic',
			{ method: localTransferInfo.method },
			{ version: 4 }
		).addSignature(sender, signat, localTransferInfo.tx);

		const tx = extrinsic.toHex()

		await api.rpc.author.submitExtrinsic(tx);

	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

export const liquidPoolsTests: { [K: string]: Function } = { createLocalTransferTransaction, createPayFeesTransaction };
