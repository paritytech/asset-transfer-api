// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

import type { RequireOnlyOne } from '../types';

export interface ICreateXcmType {
	createBeneficiary: (
		api: ApiPromise,
		accountId: string,
		xcmVersion: number
	) => VersionedMultiLocation;
	createDest: (
		api: ApiPromise,
		destId: string,
		xcmVersion: number
	) => VersionedMultiLocation;
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[]
	) => VersionedMultiAssets;
	createWeightLimit: (api: ApiPromise, weightLimit?: string) => WeightLimitV2;
	createFeeAssetItem: (
		api: ApiPromise,
		paysWithFeeDest?: string,
		specName?: string,
		assetIds?: string[],
		amounts?: string[],
		xcmVersion?: number
	) => u32;
}

interface IWeightLimitBase {
	Unlimited: null;
	Limited: string;
}

export type IWeightLimit = RequireOnlyOne<IWeightLimitBase>;
