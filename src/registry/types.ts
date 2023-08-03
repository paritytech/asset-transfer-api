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
	assetsPalletInstance: string | null;
	foreignAssetsPalletInstance: string | null;
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
};

export type RelayChains = 'polkadot' | 'kusama' | 'westend';
