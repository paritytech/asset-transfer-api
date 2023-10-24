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
	interior: RequireOnlyOne<XcmV2Junctions>;
};

export interface XcmV2Junctions {
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
	Parachain: number | string;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number | string;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
};

export type XcmV2Network = string | null;

export type XcmV3MultiLocation = {
	parents: number;
	interior: RequireOnlyOne<XcmV3Junctions>;
};

export interface XcmV3Junctions {
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

export type UnionXcmMultiLocation = XcmV3MultiLocation | XcmV2MultiLocation;

export type UnionXcmMultiAssets = XcmV2MultiAssets | XcmV3MultiAssets;

export interface XcmMultiAsset {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: {
		Fungible: string;
	};
}

export interface XcmV2MultiAssets {
	V2: XcmMultiAsset[];
}

export interface XcmV3MultiAssets {
	V3: XcmMultiAsset[];
}

export type FungibleStrMultiAsset = {
	fun: {
		Fungible: string;
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export type FungibleObjMultiAsset = {
	fun: {
		Fungible: { Fungible: string };
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export interface CreateAssetsOpts {
	registry: Registry;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
	api: ApiPromise;
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
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	) => Promise<UnionXcmMultiAssets>;
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
