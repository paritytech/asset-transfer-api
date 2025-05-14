// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import type { Registry } from '../../registry/index.js';
import { checkLocalTxInput } from './checkLocalTxInput.js';
import { LocalTxType } from './types.js';

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
