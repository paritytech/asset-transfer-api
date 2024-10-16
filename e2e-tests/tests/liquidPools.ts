// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

import { AssetTransferApi } from '../../src';
import { TxResult } from '../../src/types';

const createAssetApi = (api: ApiPromise, specName: string, safeXcmVersion: number): AssetTransferApi => {
	const injectedRegistry = {
		paseo: {
			'3369': {
				tokens: ['MUSE'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'muse',
				poolPairsInfo: {},
			},
		},
	};

	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, { injectedRegistry });

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

	let localTransferInfo: TxResult<'payload'>;
	try {
		localTransferInfo = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);

		const extrinsic = api.registry.createType('Extrinsic', { method: localTransferInfo.method }, { version: 4 });

		await api.tx(extrinsic).signAndSend(origin);
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

	let transferWithFeesInfo: TxResult<'payload'>;
	try {
		transferWithFeesInfo = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);

		const extrinsic = api.registry.createType('Extrinsic', { method: transferWithFeesInfo.method }, { version: 4 });

		await api.tx(extrinsic).signAndSend(origin);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

export const liquidPoolsTests: { [K: string]: Function } = { createLocalTransferTransaction, createPayFeesTransaction };
