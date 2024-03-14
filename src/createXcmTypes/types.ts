// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import type { Registry } from '../registry';
import type { RequireOnlyOne } from '../types';


export type InteriorKeyValue = RequireOnlyOne<XcmJunctionDestBeneficiary> | XcmV4JunctionDestBeneficiary[] | null;

export type XcmDestBeneficiary = {
	[x: string]: {
		parents: number;
		interior: {
			[x: string]: InteriorKeyValue
		};
	};
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
	 {
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
		XcmV3Junction,
	];
}

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

export type XcmV4Location = {
	parents: number;
	interior: RequireOnlyOne<XcmV4Junctions>;
};

export interface XcmV4Junctions {
	Here: '' | null;
	X1: XcmV4Junction;
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
	AccountKey20: { network?: XcmV2Network; id: string };
	PalletInstance: number;
	GeneralIndex: string | number;
	GeneralKey: string;
	OnlyChild: AnyJson;
	Plurality: { id: AnyJson; part: AnyJson };
	GlobalConsensus: string | AnyJson;
};

export type UnionXcmMultiLocation = XcmV4Location | XcmV3MultiLocation | XcmV2MultiLocation;

export type UnionXcmMultiAssets = XcmV2MultiAssets | XcmV3MultiAssets | XcmV4Assets;

export type UnionXcmMultiAsset = XcmV2MultiAsset | XcmV3MultiAsset | XcmV4Asset;

export type UnionXcAssetsMultiAssets = XcAssetsV2MultiAssets | XcAssetsV3MultiAssets | XcAssetsV4MultiAssets;

export type UnionXcAssetsMultiAsset = XcAssetsV2MultiAsset | XcAssetsV3MultiAsset | XcAssetsV4Asset;

export interface XcmMultiAsset {
	id: {
		Concrete: UnionXcmMultiLocation;
	};
	fun: {
		Fungible: string;
	};
}

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

export interface XcmV4Assets {
	V4: XcmAsset[];
}

export interface XcmV2MultiAsset {
	V2: XcmMultiAsset;
}

export interface XcmV3MultiAsset {
	V3: XcmMultiAsset;
}

export interface XcmV4Asset {
	V4: XcmAsset;
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

export interface XcAssetsV2MultiAsset {
	V2: FungibleObjMultiAsset;
}

export interface XcAssetsV3MultiAsset {
	V3: FungibleObjMultiAsset;
}

export interface XcAssetsV4Asset {
	V4: FungibleObjAsset;
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

export type UnionXcAssetsMultiLocation = XcAssetsV2MultiLocation | XcAssetsV3MultiLocation | XcAssetsV4Location;

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

export interface XcAssetsV4Location {
	V4: {
		id: XcmV4Location;
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

export type XcmDestBeneficiaryXcAssets =
	| XcmV4DestBeneficiary
	| XcmV3DestBeneficiary
	| XcmV2DestBeneficiary
	| XcmV2ParachainDestBeneficiary
	| XcmV3ParachainDestBeneficiary
	| XcmV4ParachainDestBeneficiary;

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

export interface ICreateXcmType {
	createBeneficiary: (accountId: string, xcmVersion: number) => XcmDestBeneficiary;
	createDest: (destId: string, xcmVersion: number, assetIds?: string[]) => XcmDestBeneficiary;
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
