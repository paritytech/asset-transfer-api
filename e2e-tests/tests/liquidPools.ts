// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

import { AssetTransferApi } from '../../src';
import { TxResult } from '../../src/types';

const createAssetApi = (api: ApiPromise, specName: string, safeXcmVersion: number): AssetTransferApi => {
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

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

export const liquidPoolsTests: { [K: string]: Function } = { createLocalTransferTransaction, createPayFeesTransaction };
