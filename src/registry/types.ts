// Copyright 2023 Parity Technologies (UK) Ltd.

interface AssetsInfo {
	[key: string]: string;
}

export type ChainInfo = {
	[x: string]: {
		specName: string;
		tokens: string[];
		assetsInfo: AssetsInfo;
	};
};

export type ChainInfoRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
};

export type RelayChains = 'polkadot' | 'kusama' | 'westend';
