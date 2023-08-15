// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

import type { Registry } from '../registry';
import type {
	RequireOnlyOne,
	XCMDestBenificiary,
	XcmMultiLocation,
	XcmVersionedMultiAsset,
	XcmWeight,
} from '../types';

export interface CreateAssetsOpts {
	registry: Registry;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
}

export interface CreateFeeAssetItemOpts {
	registry: Registry;
	paysWithFeeDest?: string;
	specName?: string;
	assetIds?: string[];
	amounts?: string[];
	xcmVersion?: number;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
}

export interface CreateWeightLimitOpts {
	isLimited?: boolean;
	refTime?: string;
	proofSize?: string;
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
	) => Promise<VersionedMultiAssets>;
	createWeightLimit: (
		api: ApiPromise,
		opts: CreateWeightLimitOpts
	) => WeightLimitV2;
	createFeeAssetItem: (
		api: ApiPromise,
		opts: CreateFeeAssetItemOpts
	) => Promise<u32>;
	createXTokensBeneficiary?: (
		destChainId: string,
		accountId: string,
		xcmVersion: number
	) => XCMDestBenificiary;
	createXTokensAssets?: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	) => Promise<VersionedMultiAssets>;
	createXTokensAsset?: (
		api: ApiPromise,
		amount: string,
		xcmVersion: number,
		specName: string,
		asset: string,
		opts: CreateAssetsOpts
	) => Promise<XcmVersionedMultiAsset>;
	createXTokensWeightLimit?: (opts: CreateWeightLimitOpts) => XcmWeight;
	createXTokensFeeAssetItem?: (
		api: ApiPromise,
		opts: CreateFeeAssetItemOpts
	) => XcmMultiLocation;
}

interface IWeightLimitBase {
	Unlimited: null;
	Limited: {
		refTime: string;
		proofSize: string;
	};
}

export type IWeightLimit = RequireOnlyOne<IWeightLimitBase>;
