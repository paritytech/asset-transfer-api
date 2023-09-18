// Copyright 2023 Parity Technologies (UK) Ltd.

export interface AssetsInfo {
	[key: string]: string;
}

export interface ForeignAssetsData {
	symbol: string;
	name: string;
	multiLocation: string;
}

export interface ForeignAssetsInfo {
	[key: string]: ForeignAssetsData;
}

export type PoolPairsData = {
	[key: string]: {
		lpToken: string;
		pairInfo: string;
	};
};

export interface ChainInfoKeys {
	specName: string;
	tokens: string[];
	assetsInfo: AssetsInfo;
	foreignAssetsInfo: ForeignAssetsInfo;
	poolPairsInfo: PoolPairsData;
	xcAssetsData?: SanitizedXcAssetsData[];
}

export type ExpandedChainInfoKeys = { chainId: string } & ChainInfoKeys;

export type ChainInfo = {
	[x: string]: ChainInfoKeys;
};

export type ChainInfoRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
};

export type RelayChains = 'polkadot' | 'kusama' | 'westend';

export type InterMultiLocationJunctionType = 'here' | 'x1' | 'x2' | 'x3' | 'x4' | 'x5' | 'x6' | 'x7' | 'x8';
type XCMRegistryInteriorMultiLocation = Partial<
	Record<InterMultiLocationJunctionType, null | XCMRegistryJunction | XCMRegistryJunctions>
>;

export type XCMRegistryJunction = {
	[x: string]: string | number | undefined | null | Partial<Record<string, string | number | undefined | null>>;
};
export type XCMRegistryJunctions = {
	[x: string]: string | number | undefined | null | Partial<Record<string, string | number | undefined | null>>;
}[];

export interface XCMRegistryMultiLocation {
	parents: number;
	interior: XCMRegistryInteriorMultiLocation;
}

export interface XCMAssetRegistryMultiLocation {
	v1: XCMRegistryMultiLocation;
}

export type SanitizedXcAssetsData = {
	paraID: number;
	symbol: string;
	decimals: number;
	xcmV1MultiLocation: string;
	asset:
		| { ForeignAsset: string }
		| { VToken: string }
		| { VToken2: string }
		| { VSToken: string }
		| { VSToken2: string }
		| { Token2: string }
		| { Native: string }
		| { Stable: string }
		| string;
};

export type AssetsInfoType = 'assetsInfo' | 'foreignAssetsInfo' | 'poolPairsInfo';
