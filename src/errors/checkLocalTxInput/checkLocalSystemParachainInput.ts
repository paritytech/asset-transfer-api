// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { checkLocalTxInput } from './checkLocalTxInput';
import { LocalTxType } from './types';

export const checkLocalSystemParachainInput = async (
	api: ApiPromise,
	assetIds: string[],
	amounts: string[],
	specName: string,
	registry: Registry,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
): Promise<LocalTxType> => {
	return await checkLocalTxInput(
		api,
		assetIds,
		amounts,
		specName,
		registry,
		xcmVersion,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
	);
};
