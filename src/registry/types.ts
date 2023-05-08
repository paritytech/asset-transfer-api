// Copyright 2023 Parity Technologies (UK) Ltd.

export type ChainInfo = {
	[x: string]: {
		specName: string;
		tokens: string[];
		assetIds?: number[];
	};
};

export type ChainInfoRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
};
