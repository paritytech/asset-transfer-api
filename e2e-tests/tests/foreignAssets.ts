// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { EXTRINSIC_VERSION } from 'consts';

import { AssetTransferApi } from '../../src';
import { TxResult } from '../../src/types';

const createAssetApi = (api: ApiPromise, specName: string, safeXcmVersion: number): AssetTransferApi => {
	const injectedRegistry = {
		rococo: {
			'1836': {
				tokens: ['HOP'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'trappist-rococo',
				poolPairsInfo: {},
			},
		},
	};

	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, { injectedRegistry });

	return assetApi;
};

const createForeignTransferTransaction = async (
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

		const payload = api.createType('ExtrinsicPayload', localTransferInfo.tx, {
			version: EXTRINSIC_VERSION,
		});

		const extrinsic = api.registry.createType('Extrinsic', { method: payload.method }, { version: 4 });

		await api.tx(extrinsic).signAndSend(origin);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

const createLocalForeignTransferTransaction = async (
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

		const payload = api.createType('ExtrinsicPayload', localTransferInfo.tx, {
			version: EXTRINSIC_VERSION,
		});

		const extrinsic = api.registry.createType('Extrinsic', { method: payload.method }, { version: 4 });

		await api.tx(extrinsic).signAndSend(origin);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};

export const foreignAssetsTests: { [K: string]: Function } = {
	createForeignTransferTransaction,
	createLocalForeignTransferTransaction,
};
