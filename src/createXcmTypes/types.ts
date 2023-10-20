// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type { VersionedMultiAssets, WeightLimitV2 } from '@polkadot/types/interfaces';

import type { Registry } from '../registry';
import type { RequireOnlyOne, XCMDestBenificiary, XcmMultiLocation, XcmVersionedMultiAsset, XcmWeight } from '../types';

export type XcmBase = {
	[x: string]: {
		parents: number,
		interior: {
			[x: string]: RequireOnlyOne<XcmJunction>
		}
	}
}

export type XcmAccountId32 = {
	AccountId32: {
		network?: string;
		id: string;
	}
}

export type XcmJunction = {
	AccountId32?: {
		network?: string;
		id: string;
	},
	Parachain: string
}

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
	weightLimit?: { refTime?: string; proofSize?: string };
}

export interface CheckXcmTxInputsOpts {
	xcmVersion: number;
	paysWithFeeDest?: string;
	isLimited?: boolean;
	weightLimit?: { refTime?: string; proofSize?: string };
}

export interface ICreateXcmType {
	createBeneficiary: (accountId: string, xcmVersion: number) => XcmBase;
	createDest: (destId: string, xcmVersion: number) => XcmBase;
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	) => Promise<VersionedMultiAssets>;
	createWeightLimit: (api: ApiPromise, opts: CreateWeightLimitOpts) => WeightLimitV2;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => Promise<u32>;
	createXTokensBeneficiary?: (destChainId: string, accountId: string, xcmVersion: number) => XCMDestBenificiary;
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
	createXTokensFeeAssetItem?: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => XcmMultiLocation;
}

interface IWeightLimitBase {
	Unlimited: null;
	Limited: {
		refTime: string;
		proofSize: string;
	};
}

export type IWeightLimit = RequireOnlyOne<IWeightLimitBase>;
