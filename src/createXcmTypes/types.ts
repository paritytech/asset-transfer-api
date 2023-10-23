// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type { VersionedMultiAssets, WeightLimitV2 } from '@polkadot/types/interfaces';
import type { AnyJson } from '@polkadot/types/types';

import type { Registry } from '../registry';
import type { RequireOnlyOne, XCMDestBenificiary, XcmMultiLocation, XcmVersionedMultiAsset, XcmWeight } from '../types';

export type XcmBase = {
	[x: string]: {
		parents: number;
		interior: {
			[x: string]: RequireOnlyOne<XcmJunction> | null;
		};
	};
};

export type XcmJunction = {
	AccountId32: {
		network?: string;
		id: string;
	};
	AccountKey20: {
		network?: string;
		key: string;
	};
	Parachain: string;
};

export type XcmV2MultiLocation = {
	parents: number;
	interior: XcmV2Junctions;
};

export type XcmV2Junctions = {
	Here: '' | null;
	X1: XcmV2Junction;
	X2: [XcmV2Junction, XcmV2Junction];
	X3: [XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X4: [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X5: [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X6: [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X7: [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction];
	X8: [
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction,
		XcmV2Junction
	];
};

export type XcmV2Junction = RequireOnlyOne<XcmV2JunctionBase>;

export type XcmV2JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
};

export type XcmV2Network = string | null;

export type XcmV3MultiLocation = {
	parents: number;
	interior: XcmV3Junctions;
};

export type XcmV3Junctions = {
	Here: '' | null;
	X1: XcmV3Junction;
	X2: [XcmV3Junction, XcmV3Junction];
	X3: [XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X4: [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X5: [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X6: [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X7: [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction];
	X8: [
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction,
		XcmV3Junction
	];
};

export type XcmV3Junction = RequireOnlyOne<XcmV3JunctionBase>;

export type XcmV3JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

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
