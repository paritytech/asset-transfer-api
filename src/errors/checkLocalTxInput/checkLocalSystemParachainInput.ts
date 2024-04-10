// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import type { Registry } from '../../registry';
import { checkLocalTxInput } from './checkLocalTxInput';
import { LocalTxType } from './types';

export const checkLocalSystemParachainInput = async (
	api: ApiPromise,
	assetIds: string[],
	amounts: string[],
	specName: string,
	registry: Registry,
	xcmVersion: number,
	isAssetLocationTransfer: boolean,
	isLiquidTokenTransfer: boolean,
): Promise<LocalTxType> => {
	return await checkLocalTxInput(
		api,
		assetIds,
		amounts,
		specName,
		registry,
		xcmVersion,
		isAssetLocationTransfer,
		isLiquidTokenTransfer,
	);
};
