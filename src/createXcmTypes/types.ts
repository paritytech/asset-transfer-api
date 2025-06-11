// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import type { Registry } from '../registry/index.js';
import type { RequireOnlyOne } from '../types.js';

export enum XcmVersionKey {
	V2 = 'V2',
	V3 = 'V3',
	V4 = 'V4',
	V5 = 'V5',
}

type VersionedWrapper<K extends string, T> = { [P in K]: T };

export type InteriorValue = RequireOnlyOne<XcmJunctionDestBeneficiary> | XcmV4JunctionDestBeneficiary[] | null;

export type XcmDestBeneficiary = {
	[x: string]: {
		parents: number;
		interior: InteriorKey;
	};
};

export type InteriorKey = {
	[x: string]: InteriorValue;
};

export type XcmJunctionDestBeneficiary = {
	AccountId32: {
		network?: string;
		id: string;
	};
	AccountKey20: {
		network?: string;
		key: string;
	};
	Parachain: string;
	GlobalConsensus: string | AnyJson;
};

export type XcmV4JunctionDestBeneficiary =
	| {
			AccountId32: {
				network?: string;
				id: string;
			};
	  }
	| {
			Parachain: string;
	  }
	| {
			AccountKey20: {
				network?: string;
				key: string;
			};
	  }
	| {
			GlobalConsensus: string | AnyJson;
	  };

export type Junctions<T> = {
	Here: '' | null;
	X1: T;
	X2: [T, T];
	X3: [T, T, T];
	X4: [T, T, T, T];
	X5: [T, T, T, T, T];
	X6: [T, T, T, T, T, T];
	X7: [T, T, T, T, T, T, T];
	X8: [T, T, T, T, T, T, T, T];
};

export type XcmV2Junctions = Junctions<XcmV2Junction>;
export type XcmV3Junctions = Junctions<XcmV3Junction>;
export type XcmV4Junctions = Junctions<XcmV4Junction>;
export type XcmV5Junctions = Junctions<XcmV5Junction>;

type Junction<T> = RequireOnlyOne<T>;

export type XcmV2Junction = Junction<XcmV2JunctionBase>;
export type XcmV3Junction = Junction<XcmV3JunctionBase>;
export type XcmV4Junction = Junction<XcmV4JunctionBase>;
export type XcmV5Junction = Junction<XcmV5JunctionBase>;

type MultiLocation<J> = {
	parents: number;
	interior: RequireOnlyOne<J>;
};

export type XcmV2MultiLocation = MultiLocation<XcmV2Junctions>;
export type XcmV3MultiLocation = MultiLocation<XcmV3Junctions>;
export type XcmV4MultiLocation = MultiLocation<XcmV4Junctions>;
export type XcmV5MultiLocation = MultiLocation<XcmV5Junctions>;

export type XcmV2JunctionBase = {
	Parachain: number | string;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; key: string };
	PalletInstance: number | string;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
};

export type XcmV2Network = string | null;

export type XcmV3JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; key: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

export type XcmV4JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; key: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

export type XcmV5JunctionBase = {
	Parachain: number;
	AccountId32: { network?: XcmV2Network; id: string };
	AccountIndex64: { network?: XcmV2Network; id: string };
	AccountKey20: { network?: XcmV2Network; key: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

export type UnionJunction = XcmV2Junction | XcmV3Junction | XcmV4Junction | XcmV5Junction;

export type UnionXcmMultiLocation = XcmV2MultiLocation | XcmV3MultiLocation | XcmV4MultiLocation;

export type UnionXcmMultiAssets = XcmV2MultiAssets | XcmV3MultiAssets | XcmV4MultiAssets | XcmV5MultiAssets;

export type UnionXcmMultiAsset = XcmV2MultiAsset | XcmV3MultiAsset | XcmV4MultiAsset | XcmV5MultiAsset;

export type UnionXcAssetsMultiAssets =
	| XcAssetsV2MultiAssets
	| XcAssetsV3MultiAssets
	| XcAssetsV4MultiAssets
	| XcAssetsV5MultiAssets;

export type UnionXcAssetsMultiAsset =
	| XcAssetsV2MultiAsset
	| XcAssetsV3MultiAsset
	| XcAssetsV4MultiAsset
	| XcAssetsV5MultiAsset;

export interface XcmMultiAsset {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: {
		Fungible: string;
	};
}

export interface WildAssetV3 {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: string;
}

export interface WildAssetV4 {
	id: UnionXcmMultiLocation;
	fun: string;
}

export type WildAsset = WildAssetV3 | WildAssetV4;

// XCM V4 Asset
export interface XcmAsset {
	id: UnionXcmMultiLocation;
	fun: {
		Fungible: string;
	};
}

type VersionedXcmType<K extends string, T> = {
	[P in K]: T;
};
export type XcmV2MultiAssets = VersionedXcmType<XcmVersionKey.V2, XcmMultiAsset[]>;
export type XcmV3MultiAssets = VersionedXcmType<XcmVersionKey.V3, XcmMultiAsset[]>;
export type XcmV4MultiAssets = VersionedXcmType<XcmVersionKey.V4, XcmAsset[]>;
export type XcmV5MultiAssets = VersionedXcmType<XcmVersionKey.V5, XcmAsset[]>;

export type XcmV2MultiAsset = VersionedXcmType<XcmVersionKey.V2, XcmMultiAsset>;
export type XcmV3MultiAsset = VersionedXcmType<XcmVersionKey.V3, XcmMultiAsset>;
export type XcmV4MultiAsset = VersionedXcmType<XcmVersionKey.V4, XcmAsset>;
export type XcmV5MultiAsset = VersionedXcmType<XcmVersionKey.V5, XcmAsset>;

export type XcAssetsV2MultiAssets = VersionedXcmType<XcmVersionKey.V2, FungibleObjMultiAsset[]>;
export type XcAssetsV3MultiAssets = VersionedXcmType<XcmVersionKey.V3, FungibleObjMultiAsset[]>;
export type XcAssetsV4MultiAssets = VersionedXcmType<XcmVersionKey.V4, FungibleObjAsset[]>;
export type XcAssetsV5MultiAssets = VersionedXcmType<XcmVersionKey.V5, FungibleObjAsset[]>;

export type XcAssetsV2MultiAsset = VersionedXcmType<XcmVersionKey.V2, FungibleObjMultiAsset>;
export type XcAssetsV3MultiAsset = VersionedXcmType<XcmVersionKey.V3, FungibleObjMultiAsset>;
export type XcAssetsV4MultiAsset = VersionedXcmType<XcmVersionKey.V4, FungibleObjAsset>;
export type XcAssetsV5MultiAsset = VersionedXcmType<XcmVersionKey.V5, FungibleObjAsset>;

export type FungibleStrMultiAsset = {
	fun: {
		Fungible: string;
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export type FungibleStrAsset = {
	fun: {
		Fungible: string;
	};
	id: UnionXcmMultiLocation;
};

export type FungibleStrAssetType = FungibleStrMultiAsset | FungibleStrAsset;

export type FungibleObjMultiAsset = {
	fun: {
		Fungible: { Fungible: string };
	};
	id: {
		Concrete: UnionXcmMultiLocation;
	};
};

export type FungibleObjAsset = {
	fun: {
		Fungible: { Fungible: string };
	};
	id: UnionXcmMultiLocation;
};

export type FungibleObjAssetType = FungibleObjMultiAsset | FungibleObjAsset;

export type UnionXcAssetsMultiLocation =
	| XcAssetsV2MultiLocation
	| XcAssetsV3MultiLocation
	| XcAssetsV4MultiLocation
	| XcAssetsV5MultiLocation;

type XcAssetsMultiLocationMap = {
	V2: { id: { Concrete: XcmV2MultiLocation } };
	V3: { id: { Concrete: XcmV3MultiLocation } };
	V4: { id: XcmV4MultiLocation };
	V5: { id: XcmV5MultiLocation };
};
export type XcAssetsV2MultiLocation = VersionedWrapper<XcmVersionKey.V2, XcAssetsMultiLocationMap[XcmVersionKey.V2]>;
export type XcAssetsV3MultiLocation = VersionedWrapper<XcmVersionKey.V3, XcAssetsMultiLocationMap[XcmVersionKey.V3]>;
export type XcAssetsV4MultiLocation = VersionedWrapper<XcmVersionKey.V4, XcAssetsMultiLocationMap[XcmVersionKey.V4]>;
export type XcAssetsV5MultiLocation = VersionedWrapper<XcmVersionKey.V5, XcAssetsMultiLocationMap[XcmVersionKey.V5]>;

type XcmDestBeneficiaryMap = {
	V2: {
		parents: string | number;
		interior: { X1: { AccountId32: { id: string } } };
	};
	V3: {
		parents: string | number;
		interior: { X1: { AccountId32: { id: string } } };
	};
	V4: {
		parents: string | number;
		interior: { X1: [{ AccountId32: { id: string } }] };
	};
	V5: {
		parents: string | number;
		interior: { X1: [{ AccountId32: { id: string } }] };
	};
};
export type XcmV2DestBeneficiary = VersionedWrapper<XcmVersionKey.V2, XcmDestBeneficiaryMap[XcmVersionKey.V2]>;
export type XcmV3DestBeneficiary = VersionedWrapper<XcmVersionKey.V3, XcmDestBeneficiaryMap[XcmVersionKey.V3]>;
export type XcmV4DestBeneficiary = VersionedWrapper<XcmVersionKey.V4, XcmDestBeneficiaryMap[XcmVersionKey.V4]>;
export type XcmV5DestBeneficiary = VersionedWrapper<XcmVersionKey.V5, XcmDestBeneficiaryMap[XcmVersionKey.V5]>;

export interface XcmV2ParachainDestBeneficiary {
	V2: {
		parents: string | number;
		interior: {
			X2:
				| [{ Parachain: string }, { AccountId32: { id: string } }]
				| [{ Parachain: string }, { AccountKey20: { key: string } }];
		};
	};
}

export interface XcmV3ParachainDestBeneficiary {
	V3: {
		parents: string | number;
		interior: {
			X2:
				| [{ Parachain: string }, { AccountId32: { id: string } }]
				| [{ Parachain: string }, { AccountKey20: { key: string } }];
		};
	};
}

export interface XcmV4ParachainDestBeneficiary {
	V4: {
		parents: string | number;
		interior: {
			X2:
				| [{ Parachain: string }, { AccountId32: { id: string } }]
				| [{ Parachain: string }, { AccountKey20: { key: string } }];
		};
	};
}

export interface XcmV5ParachainDestBeneficiary {
	V5: {
		parents: string | number;
		interior: {
			X2:
				| [{ Parachain: string }, { AccountId32: { id: string } }]
				| [{ Parachain: string }, { AccountKey20: { key: string } }];
		};
	};
}

export type XcmDestBeneficiaryXcAssets =
	| XcmV2DestBeneficiary
	| XcmV3DestBeneficiary
	| XcmV4DestBeneficiary
	| XcmV5DestBeneficiary
	| XcmV2ParachainDestBeneficiary
	| XcmV3ParachainDestBeneficiary
	| XcmV4ParachainDestBeneficiary
	| XcmV5ParachainDestBeneficiary;

export interface XcmWeightUnlimited {
	Unlimited: null | undefined;
}

export interface XcmWeightLimited {
	Limited: {
		refTime: string;
		proofSize: string;
	};
}

export type XcmWeight = XcmWeightUnlimited | XcmWeightLimited;

export interface CreateAssetsOpts {
	registry: Registry;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
	api: ApiPromise;
	destChainId?: string;
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
export type WeightV2 = { refTime?: string; proofSize?: string };

export interface CreateWeightLimitOpts {
	weightLimit?: WeightV2;
}

type XcmAssetIdMap = {
	V2: { Concrete: UnionXcmMultiLocation };
	V3: { Concrete: UnionXcmMultiLocation };
	V4: UnionXcmMultiLocation;
	V5: UnionXcmMultiLocation;
};

export type XcmVersionedAssetIdV2 = VersionedWrapper<XcmVersionKey.V2, XcmAssetIdMap[XcmVersionKey.V2]>;
export type XcmVersionedAssetIdV3 = VersionedWrapper<XcmVersionKey.V3, XcmAssetIdMap[XcmVersionKey.V3]>;
export type XcmVersionedAssetIdV4 = VersionedWrapper<XcmVersionKey.V4, XcmAssetIdMap[XcmVersionKey.V4]>;
export type XcmVersionedAssetIdV5 = VersionedWrapper<XcmVersionKey.V5, XcmAssetIdMap[XcmVersionKey.V5]>;

export type XcmVersionedAssetId =
	| XcmVersionedAssetIdV2
	| XcmVersionedAssetIdV3
	| XcmVersionedAssetIdV4
	| XcmVersionedAssetIdV5;

export interface ICreateXcmType {
	createBeneficiary: (accountId: string, xcmVersion: number) => XcmDestBeneficiary;
	createDest: (destId: string, xcmVersion: number) => XcmDestBeneficiary;
	createAssets: (
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<UnionXcmMultiAssets>;
	createWeightLimit: (opts: CreateWeightLimitOpts) => XcmWeight;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => Promise<number>;
	createXTokensBeneficiary?: (destChainId: string, accountId: string, xcmVersion: number) => XcmDestBeneficiaryXcAssets;
	createXTokensAssets?: (
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<UnionXcAssetsMultiAssets>;
	createXTokensAsset?: (
		amount: string,
		xcmVersion: number,
		specName: string,
		asset: string,
		opts: CreateAssetsOpts,
	) => Promise<UnionXcAssetsMultiAsset>;
	createXTokensWeightLimit?: (opts: CreateWeightLimitOpts) => XcmWeight;
	createXTokensFeeAssetItem?: (opts: CreateFeeAssetItemOpts) => UnionXcAssetsMultiLocation;
}
