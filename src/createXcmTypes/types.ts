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

type JunctionVariant<T> = RequireOnlyOne<T>;
type XcmJunctionForVersion<V extends XcmVersionKey> = JunctionVariant<XcmJunctionBase<V>>;
// Union of all Junctions
// type XcmJunction = {
// 	[V in XcmVersionKey]: XcmJunctionForVersion<V>;
// }[XcmVersionKey];

export type XcmV2Junction = XcmJunctionForVersion<XcmVersionKey.V2>;
export type XcmV3Junction = XcmJunctionForVersion<XcmVersionKey.V3>;
export type XcmV4Junction = XcmJunctionForVersion<XcmVersionKey.V4>;
export type XcmV5Junction = XcmJunctionForVersion<XcmVersionKey.V5>;

type MultiLocationVariant<J> = {
	parents: number;
	interior: RequireOnlyOne<J>;
};

export type XcmV2MultiLocation = MultiLocationVariant<XcmV2Junctions>;
export type XcmV3MultiLocation = MultiLocationVariant<XcmV3Junctions>;
export type XcmV4MultiLocation = MultiLocationVariant<XcmV4Junctions>;
export type XcmV5MultiLocation = MultiLocationVariant<XcmV5Junctions>;

type XcmNetwork = string | null;

type XcmJunctionFields = {
	AccountId32: { network?: XcmNetwork; id: string };
	AccountIndex64: { network?: XcmNetwork; id: string };
	AccountKey20: { network?: XcmNetwork; key: string };
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Parachain: number;
	PalletInstance: number;
	Plurality: { id: AnyJson; part: AnyJson };
};
type XcmJunctionExtras<V extends XcmVersionKey> = V extends XcmVersionKey.V2
	? {}
	: V extends Exclude<XcmVersionKey, XcmVersionKey.V2>
		? { GlobalConsensus: string | AnyJson }
		: never;
type XcmJunctionBase<V extends XcmVersionKey> = XcmJunctionFields & XcmJunctionExtras<V>;

export type Junction = XcmV2Junction | XcmV3Junction | XcmV4Junction | XcmV5Junction;

export type XcmMultiLocation = XcmV2MultiLocation | XcmV3MultiLocation | XcmV4MultiLocation | XcmV5MultiLocation;

type VersionedXcmType<K extends string, T> = {
	[P in K]: T;
};

type AssetTypeForVersion<V extends XcmVersionKey> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? FungibleMultiAsset
	: FungibleAsset;
type XcAssetsMultiAssetVariant<V extends XcmVersionKey> = VersionedXcmType<V, AssetTypeForVersion<V>>;
export type XcAssetsMultiAsset = {
	[V in XcmVersionKey]: XcAssetsMultiAssetVariant<V>;
}[XcmVersionKey];

type XcmMultiAssetsVariant<V extends XcmVersionKey> = VersionedXcmType<V, AssetTypeForVersion<V>[]>;
export type XcmMultiAssets = {
	[V in XcmVersionKey]: XcmMultiAssetsVariant<V>;
}[XcmVersionKey];

interface WildAssetV3 {
	id: {
		Concrete: XcmMultiLocation;
	};
	fun: string;
}

interface WildAssetV4 {
	id: XcmMultiLocation;
	fun: string;
}

export type WildAsset = WildAssetV3 | WildAssetV4;

export type FungibleAsset<T = XcmMultiLocation> = {
	fun: {
		Fungible: string;
	};
	id: T;
};

export type FungibleMultiAsset = FungibleAsset<{ Concrete: XcmMultiLocation }>;
export type FungibleAssetType = FungibleAsset | FungibleMultiAsset;

export type XcAssetsMultiLocation =
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
	V2: { Concrete: XcmMultiLocation };
	V3: { Concrete: XcmMultiLocation };
	V4: XcmMultiLocation;
	V5: XcmMultiLocation;
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
	) => Promise<XcmMultiAssets>;
	createWeightLimit: (opts: CreateWeightLimitOpts) => XcmWeight;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => Promise<number>;
	createXTokensBeneficiary?: (destChainId: string, accountId: string) => XcmDestBeneficiaryXcAssets;
	createXTokensAssets?: (
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<XcmMultiAssets>;
	createXTokensAsset?: (
		amount: string,
		specName: string,
		asset: string,
		opts: CreateAssetsOpts,
	) => Promise<XcAssetsMultiAsset>;
	createXTokensWeightLimit?: (opts: CreateWeightLimitOpts) => XcmWeight;
	createXTokensFeeAssetItem?: (opts: { paysWithFeeDest?: string }) => XcAssetsMultiLocation;
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
	resolveMultiLocation: (multiLocation: AnyJson) => XcmMultiLocation;
	multiAsset: (asset: FungibleAssetType) => XcAssetsMultiAsset;
	multiAssets: (assets: FungibleAssetType[]) => XcmMultiAssets;
	multiLocation: (multiLocation: XcmMultiLocation) => XcAssetsMultiLocation;
	remoteReserve: (multiLocation: XcmMultiLocation) => RemoteReserve;
	versionedAssetId: (multiLocation: XcmMultiLocation) => XcmVersionedAssetId;
	parachainDest: (opts: { destId: string; parents: number }) => XcmDestBeneficiary;
	hereDest: (opts: { parents: number }) => XcmDestBeneficiary;
	interiorDest: (opts: { destId: string; parents: number }) => XcmDestBeneficiary;
	hereAsset: (opts: { amount: string; parents: number }) => XcmMultiAssets;
	xcmMessage: (msg: AnyJson) => AnyJson;
}
