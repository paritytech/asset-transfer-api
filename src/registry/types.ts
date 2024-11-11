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

export interface InjectedChainInfoKeys {
	specName?: string;
	tokens?: string[];
	assetsInfo?: AssetsInfo;
	foreignAssetsInfo?: ForeignAssetsInfo;
	poolPairsInfo?: PoolPairsData;
	xcAssetsData?: SanitizedXcAssetsData[];
}
export type ExpandedChainInfoKeys = { chainId: string } & ChainInfoKeys;

export type ChainInfo<T extends ChainInfoKeys | InjectedChainInfoKeys> = {
	[x: string]: T;
};

export type ChainInfoRegistry<T extends ChainInfoKeys | InjectedChainInfoKeys> = {
	polkadot: ChainInfo<T>;
	kusama: ChainInfo<T>;
	westend: ChainInfo<T>;
	paseo: ChainInfo<T>;
};

export type RelayChains = 'polkadot' | 'kusama' | 'westend' | 'paseo';

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
	symbol: string;
	xcmV1MultiLocation: string;
	paraID?: number;
	decimals?: number;
	asset?:
		| { ForeignAsset: string }
		| { VToken: string }
		| { VToken2: string }
		| { VSToken: string }
		| { VSToken2: string }
		| { Token2: string }
		| { Token: string }
		| { Native: string }
		| { Stable: string }
		| string;
	assetHubReserveLocation?: string;
	originChainReserveLocation?: string;
};

export type AssetsInfoType = 'assetsInfo' | 'foreignAssetsInfo' | 'poolPairsInfo';
