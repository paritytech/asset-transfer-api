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
	foreignAssetsInfo: ForeignAssetsInfo | {};
	poolPairsInfo: PoolPairsData | {};
}

export type ExpandedChainInfoKeys = { chainId: string } & ChainInfoKeys;

export type ChainInfo = {
	[x: string]: ChainInfoKeys;
};

export type ChainInfoRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
	xcAssets: XCMChainInfoRegistry;
};

export type RelayChains = 'polkadot' | 'kusama' | 'westend';

export type InterMultiLocationJunctionType =
	| 'here'
	| 'x1'
	| 'x2'
	| 'x3'
	| 'x4'
	| 'x5'
	| 'x6'
	| 'x7'
	| 'x8';
type XCMRegistryInteriorMultiLocation = Partial<
	Record<
		InterMultiLocationJunctionType,
		null | XCMRegistryJunction | XCMRegistryJunctions
	>
>;

export type XCMRegistryJunction = {
	[x: string]:
		| string
		| number
		| undefined
		| null
		| Partial<Record<string, string | number | undefined | null>>;
};
export type XCMRegistryJunctions = {
	[x: string]:
		| string
		| number
		| undefined
		| null
		| Partial<Record<string, string | number | undefined | null>>;
}[];

export interface XCMRegistryMultiLocation {
	parents: number;
	interior: XCMRegistryInteriorMultiLocation;
}

export interface XCMAssetRegistryMultiLocation {
	v1: XCMRegistryMultiLocation;
}

export interface XCMChainInfoDataKeys {
	paraID?: number;
	relayChain: string;
	nativeChainID: string | null;
	symbol: string;
	decimals: number;
	interiorType: string;
	xcmV1Standardized: Array<XCMRegistryJunction | string>;
	xcmV1MultiLocationByte: boolean | string;
	xcmV1MultiLocation: XCMAssetRegistryMultiLocation;
	asset: string | { [x: string]: string | undefined };
	source: string[];
}

export interface XCMChainInfoKeys {
	relayChain: string;
	paraID: number;
	id: string;
	xcAssetCnt: string;
	data: XCMChainInfoDataKeys[];
}

export type XCMChainInfoRegistry = {
	polkadot: XCMChainInfoKeys[];
	kusama: XCMChainInfoKeys[];
};

export type AssetsInfoType =
	| 'assetsInfo'
	| 'foreignAssetsInfo'
	| 'poolPairsInfo';
