// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import type { Registry } from '../registry/index.js';
import type { RequireOnlyOne } from '../types.js';

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
		XcmV2Junction,
	];
}

export type XcmV2Junction = RequireOnlyOne<XcmV2JunctionBase>;

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
		XcmV3Junction,
	];
}

export type XcmV3Junction = RequireOnlyOne<XcmV3JunctionBase>;

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

export type XcmV4MultiLocation = {
	parents: number;
	interior: RequireOnlyOne<XcmV4Junctions>;
};

export interface XcmV4Junctions {
	Here: '' | null;
	X1: [XcmV4Junction];
	X2: [XcmV4Junction, XcmV4Junction];
	X3: [XcmV4Junction, XcmV4Junction, XcmV4Junction];
	X4: [XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction];
	X5: [XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction];
	X6: [XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction];
	X7: [XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction, XcmV4Junction];
	X8: [
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
		XcmV4Junction,
	];
}

export type XcmV4Junction = RequireOnlyOne<XcmV4JunctionBase>;

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

export type XcmV5MultiLocation = {
	parents: number;
	interior: RequireOnlyOne<XcmV5Junctions>;
};

export interface XcmV5Junctions {
	Here: '' | null;
	X1: [XcmV5Junction];
	X2: [XcmV5Junction, XcmV5Junction];
	X3: [XcmV5Junction, XcmV5Junction, XcmV5Junction];
	X4: [XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction];
	X5: [XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction];
	X6: [XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction];
	X7: [XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction, XcmV5Junction];
	X8: [
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
		XcmV5Junction,
	];
}

export type XcmV5Junction = RequireOnlyOne<XcmV5JunctionBase>;

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

export interface XcmV2MultiAssets {
	V2: XcmMultiAsset[];
}

export interface XcmV3MultiAssets {
	V3: XcmMultiAsset[];
}

export interface XcmV4MultiAssets {
	V4: XcmAsset[];
}

export interface XcmV5MultiAssets {
	V5: XcmAsset[];
}

export interface XcmV2MultiAsset {
	V2: XcmMultiAsset;
}

export interface XcmV3MultiAsset {
	V3: XcmMultiAsset;
}

export interface XcmV4MultiAsset {
	V4: XcmAsset;
}

export interface XcmV5MultiAsset {
	V5: XcmAsset;
}

export interface XcAssetsV2MultiAssets {
	V2: FungibleObjMultiAsset[];
}

export interface XcAssetsV3MultiAssets {
	V3: FungibleObjMultiAsset[];
}

export interface XcAssetsV4MultiAssets {
	V4: FungibleObjAsset[];
}

export interface XcAssetsV5MultiAssets {
	V5: FungibleObjAsset[];
}

export interface XcAssetsV2MultiAsset {
	V2: FungibleObjMultiAsset;
}

export interface XcAssetsV3MultiAsset {
	V3: FungibleObjMultiAsset;
}

export interface XcAssetsV4MultiAsset {
	V4: FungibleObjAsset;
}

export interface XcAssetsV5MultiAsset {
	V5: FungibleObjAsset;
}

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

export interface XcAssetsV2MultiLocation {
	V2: {
		id: {
			Concrete: XcmV2MultiLocation;
		};
	};
}

export interface XcAssetsV3MultiLocation {
	V3: {
		id: {
			Concrete: XcmV3MultiLocation;
		};
	};
}

export interface XcAssetsV4MultiLocation {
	V4: {
		id: XcmV4MultiLocation;
	};
}

export interface XcAssetsV5MultiLocation {
	V5: {
		id: XcmV5MultiLocation;
	};
}

export interface XcmV2DestBeneficiary {
	V2: {
		parents: string | number;
		interior: {
			X1: { AccountId32: { id: string } };
		};
	};
}

export interface XcmV3DestBeneficiary {
	V3: {
		parents: string | number;
		interior: {
			X1: { AccountId32: { id: string } };
		};
	};
}

export interface XcmV4DestBeneficiary {
	V4: {
		parents: string | number;
		interior: {
			X1: [{ AccountId32: { id: string } }];
		};
	};
}

export interface XcmV5DestBeneficiary {
	V5: {
		parents: string | number;
		interior: {
			X1: [{ AccountId32: { id: string } }];
		};
	};
}

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

export type XcmVersionedAssetIdV2 = {
	V2: {
		Concrete: UnionXcmMultiLocation;
	};
};
export type XcmVersionedAssetIdV3 = {
	V3: {
		Concrete: UnionXcmMultiLocation;
	};
};
export type XcmVersionedAssetIdV4 = {
	V4: UnionXcmMultiLocation;
};
export type XcmVersionedAssetIdV5 = {
	V5: UnionXcmMultiLocation;
};

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
