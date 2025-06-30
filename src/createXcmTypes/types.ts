import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import type { Registry } from '../registry/index.js';
import type { RemoteReserve, RequireOnlyOne } from '../types.js';

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

type XcmJunctionDestBeneficiary = {
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

type Junctions<T> = {
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

interface V4PlusJunctions<T> extends Omit<Junctions<T>, 'X1'> {
	X1: [T];
}

export type XcmV2Junctions = Junctions<XcmV2Junction>;
export type XcmV3Junctions = Junctions<XcmV3Junction>;
export type XcmV4Junctions = V4PlusJunctions<XcmV4Junction>;
export type XcmV5Junctions = V4PlusJunctions<XcmV5Junction>;

export type OneOfXcmJunctions = RequireOnlyOne<XcmV5Junctions | XcmV4Junctions | XcmV3Junctions | XcmV2Junctions>;

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

type XcmV2JunctionBase = {
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

type XcmV2Network = string | null;

type XcmV3JunctionBase = {
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

type XcmV4JunctionBase = {
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

type XcmV5JunctionBase = {
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

export type UnionXcmMultiLocation = XcmV2MultiLocation | XcmV3MultiLocation | XcmV4MultiLocation | XcmV5MultiLocation;

export type UnionXcmMultiAssets = XcmV2MultiAssets | XcmV3MultiAssets | XcmV4MultiAssets | XcmV5MultiAssets;

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

interface WildAssetV3 {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: string;
}

interface WildAssetV4 {
	id: UnionXcmMultiLocation;
	fun: string;
}

export type WildAsset = WildAssetV3 | WildAssetV4;

type VersionedXcmType<K extends string, T> = {
	[P in K]: T;
};
type XcmV2MultiAssets = VersionedXcmType<XcmVersionKey.V2, FungibleMultiAsset[]>;
type XcmV3MultiAssets = VersionedXcmType<XcmVersionKey.V3, FungibleMultiAsset[]>;
type XcmV4MultiAssets = VersionedXcmType<XcmVersionKey.V4, FungibleAsset[]>;
type XcmV5MultiAssets = VersionedXcmType<XcmVersionKey.V5, FungibleAsset[]>;

type XcAssetsV2MultiAssets = VersionedXcmType<XcmVersionKey.V2, FungibleMultiAsset[]>;
type XcAssetsV3MultiAssets = VersionedXcmType<XcmVersionKey.V3, FungibleMultiAsset[]>;
type XcAssetsV4MultiAssets = VersionedXcmType<XcmVersionKey.V4, FungibleAsset[]>;
type XcAssetsV5MultiAssets = VersionedXcmType<XcmVersionKey.V5, FungibleAsset[]>;

type XcAssetsV2MultiAsset = VersionedXcmType<XcmVersionKey.V2, FungibleMultiAsset>;
type XcAssetsV3MultiAsset = VersionedXcmType<XcmVersionKey.V3, FungibleMultiAsset>;
type XcAssetsV4MultiAsset = VersionedXcmType<XcmVersionKey.V4, FungibleAsset>;
type XcAssetsV5MultiAsset = VersionedXcmType<XcmVersionKey.V5, FungibleAsset>;

export type FungibleAsset<T = UnionXcmMultiLocation> = {
	fun: {
		Fungible: string;
	};
	id: T;
};

export type FungibleMultiAsset = FungibleAsset<{ Concrete: UnionXcmMultiLocation }>;
export type FungibleAssetType = FungibleAsset | FungibleMultiAsset;

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
type XcAssetsV2MultiLocation = VersionedWrapper<XcmVersionKey.V2, XcAssetsMultiLocationMap[XcmVersionKey.V2]>;
type XcAssetsV3MultiLocation = VersionedWrapper<XcmVersionKey.V3, XcAssetsMultiLocationMap[XcmVersionKey.V3]>;
type XcAssetsV4MultiLocation = VersionedWrapper<XcmVersionKey.V4, XcAssetsMultiLocationMap[XcmVersionKey.V4]>;
type XcAssetsV5MultiLocation = VersionedWrapper<XcmVersionKey.V5, XcAssetsMultiLocationMap[XcmVersionKey.V5]>;

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

export type ParachainX2Interior =
	| [{ Parachain: string }, { AccountId32: { id: string } }]
	| [{ Parachain: string }, { AccountKey20: { key: string } }];

export type ParachainDestBeneficiaryInner = {
	parents: string | number;
	interior: {
		X2: ParachainX2Interior;
	};
};

type VersionedParachainDestBeneficiary<K extends string> = {
	[P in K]: ParachainDestBeneficiaryInner;
};

type XcmV2ParachainDestBeneficiary = VersionedParachainDestBeneficiary<XcmVersionKey.V2>;
type XcmV3ParachainDestBeneficiary = VersionedParachainDestBeneficiary<XcmVersionKey.V3>;
type XcmV4ParachainDestBeneficiary = VersionedParachainDestBeneficiary<XcmVersionKey.V4>;
type XcmV5ParachainDestBeneficiary = VersionedParachainDestBeneficiary<XcmVersionKey.V5>;

export type XcmDestBeneficiaryXcAssets =
	| XcmV2DestBeneficiary
	| XcmV3DestBeneficiary
	| XcmV4DestBeneficiary
	| XcmV5DestBeneficiary
	| XcmV2ParachainDestBeneficiary
	| XcmV3ParachainDestBeneficiary
	| XcmV4ParachainDestBeneficiary
	| XcmV5ParachainDestBeneficiary;

export type XcmWeight = { Unlimited?: null } | { Limited: { refTime: string; proofSize: string } };

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
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
}

type WeightV2 = { refTime?: string; proofSize?: string };

export interface CreateWeightLimitOpts {
	weightLimit?: WeightV2;
}

type XcmAssetIdMap = {
	V2: { Concrete: UnionXcmMultiLocation };
	V3: { Concrete: UnionXcmMultiLocation };
	V4: UnionXcmMultiLocation;
	V5: UnionXcmMultiLocation;
};

type XcmVersionedAssetIdMap = {
	[V in XcmVersionKey]: VersionedWrapper<V, XcmAssetIdMap[V]>;
};

export type XcmVersionedAssetId = XcmVersionedAssetIdMap[XcmVersionKey];

export interface ICreateXcmTypeConstructor {
	new (xcmVersion: number): ICreateXcmType;
}

export interface ICreateXcmType {
	xcmCreator: XcmCreator;

	createBeneficiary: (accountId: string) => XcmDestBeneficiary;
	createDest: (destId: string) => XcmDestBeneficiary;
	createAssets: (
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<UnionXcmMultiAssets>;
	createWeightLimit: (opts: CreateWeightLimitOpts) => XcmWeight;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => Promise<number>;
	createXTokensBeneficiary?: (destChainId: string, accountId: string) => XcmDestBeneficiaryXcAssets;
	createXTokensAssets?: (
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<UnionXcAssetsMultiAssets>;
	createXTokensAsset?: (
		amount: string,
		specName: string,
		asset: string,
		opts: CreateAssetsOpts,
	) => Promise<UnionXcAssetsMultiAsset>;
	createXTokensWeightLimit?: (opts: CreateWeightLimitOpts) => XcmWeight;
	createXTokensFeeAssetItem?: (opts: { paysWithFeeDest?: string }) => UnionXcAssetsMultiLocation;
}

export interface XcmCreator {
	xcmVersion: number;
	beneficiary: (opts: { accountId: string; parents: number }) => XcmDestBeneficiary;
	xTokensParachainDestBeneficiary: (opts: {
		accountId: string;
		destChainId: string;
		parents: number;
	}) => XcmDestBeneficiaryXcAssets;
	xTokensDestBeneficiary: (opts: { accountId: string; parents: number }) => XcmDestBeneficiaryXcAssets;
	fungibleAsset: (opts: { amount: string; multiLocation: AnyJson }) => FungibleAssetType;
	resolveMultiLocation: (multiLocation: AnyJson) => UnionXcmMultiLocation;
	multiAsset: (asset: FungibleAssetType) => UnionXcAssetsMultiAsset;
	multiAssets: (assets: FungibleAssetType[]) => UnionXcAssetsMultiAssets;
	multiLocation: (multiLocation: UnionXcmMultiLocation) => UnionXcAssetsMultiLocation;
	remoteReserve: (multiLocation: UnionXcmMultiLocation) => RemoteReserve;
	versionedAssetId: (multiLocation: UnionXcmMultiLocation) => XcmVersionedAssetId;
	parachainDest: (opts: { destId: string; parents: number }) => XcmDestBeneficiary;
	hereDest: (opts: { parents: number }) => XcmDestBeneficiary;
	interiorDest: (opts: { destId: string; parents: number }) => XcmDestBeneficiary;
	hereAsset: (opts: { amount: string; parents: number }) => UnionXcmMultiAssets;
	xcmMessage: (msg: AnyJson) => AnyJson;
}
