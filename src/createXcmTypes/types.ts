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

type VersionedXcmType<K extends string, T> = {
	[P in K]: T;
};

// Junctions

// Junctions - Junction Base
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

// Junctions - XcmJunction
type JunctionVariant<T> = RequireOnlyOne<T>;
export type XcmJunctionForVersion<V extends XcmVersionKey> = JunctionVariant<XcmJunctionBase<V>>;
export type XcmJunction = {
	[V in XcmVersionKey]: XcmJunctionForVersion<V>;
}[XcmVersionKey];

// Junctions - Junctions
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

// Junctions - XcmJunctions
type JunctionsForVersion<V extends XcmVersionKey, T> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? Junctions<T>
	: V4PlusJunctions<T>;
export type XcmJunctionsForVersion<V extends XcmVersionKey> = JunctionsForVersion<V, XcmJunctionForVersion<V>>;
type XcmJunctions = { [V in XcmVersionKey]: XcmJunctionsForVersion<V> }[XcmVersionKey];

// Junctions - OneOfXcmJunctions
export type OneOfXcmJunctions = RequireOnlyOne<XcmJunctions>;

// MultiLocation
type MultiLocationVariant<J> = {
	parents: number;
	interior: RequireOnlyOne<J>;
};
export type XcmMultiLocationForVersion<V extends XcmVersionKey> = MultiLocationVariant<XcmJunctionsForVersion<V>>;
export type XcmMultiLocation = {
	[V in XcmVersionKey]: XcmMultiLocationForVersion<V>;
}[XcmVersionKey];
export type XcmV2MultiLocation = MultiLocationVariant<XcmJunctionsForVersion<XcmVersionKey.V2>>;
export type XcmV3MultiLocation = MultiLocationVariant<XcmJunctionsForVersion<XcmVersionKey.V3>>;
export type XcmV4MultiLocation = MultiLocationVariant<XcmJunctionsForVersion<XcmVersionKey.V4>>;
export type XcmV5MultiLocation = MultiLocationVariant<XcmJunctionsForVersion<XcmVersionKey.V5>>;
export type XcmVersionedMultiLocation = {
	[V in XcmVersionKey]: VersionedXcmType<V, XcmMultiLocationForVersion<V>>;
}[XcmVersionKey];

// XcAssetsMultiLocation
type XcAssetsMultiLocationVariant<V extends XcmVersionKey> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? { id: { Concrete: XcmMultiLocationForVersion<V> } }
	: { id: XcmMultiLocationForVersion<V> };
type XcAssetsMultiLocationForVersion<V extends XcmVersionKey> = VersionedXcmType<V, XcAssetsMultiLocationVariant<V>>;
export type XcAssetsMultiLocation = {
	[V in XcmVersionKey]: XcAssetsMultiLocationForVersion<V>;
}[XcmVersionKey];

// DestBeneficiaries

type X1BeneficiaryInner<V extends XcmVersionKey> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? { AccountId32: { id: string } }
	: [{ AccountId32: { id: string } }];
type X1BeneficiaryVariant<V extends XcmVersionKey> = {
	parents: string | number;
	interior: {
		X1: X1BeneficiaryInner<V>;
	};
};
type X1BeneficiaryForVersion<V extends XcmVersionKey> = VersionedXcmType<V, X1BeneficiaryVariant<V>>;
type X1Beneficiary = {
	[V in XcmVersionKey]: X1BeneficiaryForVersion<V>;
}[XcmVersionKey];

// only used in common.ts
export type X2BeneficiaryInner =
	| [{ Parachain: number }, { AccountId32: { id: string } }]
	| [{ Parachain: number }, { AccountKey20: { key: string } }];

// only used in common.ts
export type X2BeneficiaryVariant = {
	parents: string | number;
	interior: {
		X2: X2BeneficiaryInner;
	};
};
type X2BeneficiaryForVersion<V extends XcmVersionKey> = VersionedXcmType<V, X2BeneficiaryVariant>;
export type X2Beneficiary = {
	[V in XcmVersionKey]: X2BeneficiaryForVersion<V>;
}[XcmVersionKey];

// used in v{}.ts, createBeneficiary, ParaTo{}.ts, transferMultiassets.ts
export type XcmBeneficiary = X1Beneficiary | X2Beneficiary;

// Wild Asset
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

// XcmMultiAssets
type XcmMultiAssetsVariant<V extends XcmVersionKey> = VersionedXcmType<V, AssetTypeForVersion<V>[]>;
export type XcmMultiAssets = {
	[V in XcmVersionKey]: XcmMultiAssetsVariant<V>;
}[XcmVersionKey];

// Fungible Asset
export type FungibleAsset<T = XcmMultiLocation> = {
	fun: {
		Fungible: string;
	};
	id: T;
};

// FungibleMultiAsset
export type FungibleMultiAsset = FungibleAsset<{ Concrete: XcmMultiLocation }>;

// FungibleAssetType
export type FungibleAssetType = FungibleAsset | FungibleMultiAsset;

// XcAssetsMutiAssets
type AssetTypeForVersion<V extends XcmVersionKey> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? FungibleMultiAsset
	: FungibleAsset;
type XcAssetsMultiAssetVariant<V extends XcmVersionKey> = VersionedXcmType<V, AssetTypeForVersion<V>>;
export type XcAssetsMultiAsset = {
	[V in XcmVersionKey]: XcAssetsMultiAssetVariant<V>;
}[XcmVersionKey];

// XcmVersionedAssetId
type AssetIdForVersion<V extends XcmVersionKey> = V extends XcmVersionKey.V2 | XcmVersionKey.V3
	? { Concrete: XcmMultiLocation }
	: XcmMultiLocation;
type XcmVersionedAssetIdMap = {
	[V in XcmVersionKey]: VersionedXcmType<V, AssetIdForVersion<V>>;
};
export type XcmVersionedAssetId = XcmVersionedAssetIdMap[XcmVersionKey];

// Handlers and Type Creator

export type XcmWeight = { Unlimited?: null } | { Limited: { refTime: string; proofSize: string } };

type Weight = { refTime?: string; proofSize?: string };
export interface CreateWeightLimitOpts {
	weightLimit?: Weight;
}

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

// Handler Constructor
export interface ICreateXcmTypeConstructor {
	new (xcmVersion: number): ICreateXcmType;
}

// Handler
export interface ICreateXcmType {
	xcmCreator: XcmCreator;

	createBeneficiary: (accountId: string) => XcmVersionedMultiLocation;
	createDest: (destId: string) => XcmVersionedMultiLocation;
	createAssets: (
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	) => Promise<XcmMultiAssets>;
	createWeightLimit: (opts: CreateWeightLimitOpts) => XcmWeight;
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts) => Promise<number>;
	createXTokensBeneficiary?: (destChainId: string, accountId: string) => XcmBeneficiary;
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

// XcmCreator - per version
export interface XcmCreator {
	xcmVersion: number;
	beneficiary: (opts: { accountId: string; parents: number }) => XcmVersionedMultiLocation;
	xTokensParachainDestBeneficiary: (opts: {
		accountId: string;
		destChainId: string;
		parents: number;
	}) => XcmBeneficiary;
	xTokensDestBeneficiary: (opts: { accountId: string; parents: number }) => XcmBeneficiary;
	fungibleAsset: (opts: { amount: string; multiLocation: AnyJson }) => FungibleAssetType;
	resolveMultiLocation: (multiLocation: AnyJson) => XcmMultiLocation;
	multiAsset: (asset: FungibleAssetType) => XcAssetsMultiAsset;
	multiAssets: (assets: FungibleAssetType[]) => XcmMultiAssets;
	multiLocation: (multiLocation: XcmMultiLocation) => XcAssetsMultiLocation;
	remoteReserve: (multiLocation: XcmMultiLocation) => RemoteReserve;
	versionedAssetId: (multiLocation: XcmMultiLocation) => XcmVersionedAssetId;
	parachainDest: (opts: { destId: string; parents: number }) => XcmVersionedMultiLocation;
	hereDest: (opts: { parents: number }) => XcmVersionedMultiLocation;
	interiorDest: (opts: { destId: string; parents: number }) => XcmVersionedMultiLocation;
	hereAsset: (opts: { amount: string; parents: number }) => XcmMultiAssets;
	xcmMessage: (msg: AnyJson) => AnyJson;
}
