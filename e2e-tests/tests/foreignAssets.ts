// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

import { AssetTransferApi } from '../../src';
import { TxResult } from '../../src/types';

const createAssetApi = (api: ApiPromise, specName: string, safeXcmVersion: number): AssetTransferApi => {
	const injectedRegistry = {
		kusama: {
			'3000': {
				tokens: ['HOP'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'trappist',
				poolPairsInfo: {},
			},
		},
	};
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, {
		injectedRegistry,
	});

	return assetApi;
};

const createTransferTransaction = async (
	origin: KeyringPair,
	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	opts: object,
	api: ApiPromise,
	specName: string,
	safeXcmVersion: number
) => {
	const assetApi = createAssetApi(api, specName, safeXcmVersion);

	let localTransfer: TxResult<'submittable'>;
	try {
		localTransfer = await assetApi.createTransferTransaction(destChainId, destAddr, assetIds, amounts, opts);
		await localTransfer.tx.signAndSend(origin);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}
};
export const foreignAssetsTests: { [K: string]: Function } = { createTransferTransaction };
