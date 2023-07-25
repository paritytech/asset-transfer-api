// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

import type { Registry } from '../registry';
import type { RequireOnlyOne, XCMDestBenificiary, XcmMultiAsset, XcmWeight } from '../types';

export interface CreateAssetsOpts {
	registry: Registry;
}

export interface CreateFeeAssetItemOpts {
	registry: Registry;
	paysWithFeeDest?: string;
	specName?: string;
	assetIds?: string[];
	amounts?: string[];
	xcmVersion?: number;
}

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
		assets: string[],
		opts: CreateAssetsOpts
		) => VersionedMultiAssets;
	createWeightLimit: (api: ApiPromise, isLimited?: boolean, refTime?: string, proofSize?: string) => WeightLimitV2;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => u32;
	createXTokensBeneficiary?: (
		accountId: string,
		xcmVersion: number
	) => XCMDestBenificiary;
	createXTokensAssets?: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => XcmMultiAsset[];
	createXTokensWeightLimit?: (
		isLimited?: boolean,
		refTime?: string,
		proofSize?: string
	) => XcmWeight;
	createXTokensFeeAssetItem?: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => XcmMultiAsset;
}

interface IWeightLimitBase {
	Unlimited: null;
	Limited: {
		refTime: string,
		proofSize: string
	};
}

export type IWeightLimit = RequireOnlyOne<IWeightLimitBase>;
