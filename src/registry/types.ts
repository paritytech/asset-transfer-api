// Copyright 2023 Parity Technologies (UK) Ltd.

export interface AssetsInfo {
	[key: string]: string;
}

export interface ChainInfoKeys {
	specName: string;
	tokens: string[];
	assetsInfo: AssetsInfo;
	assetsPalletInstance: string | null;
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
