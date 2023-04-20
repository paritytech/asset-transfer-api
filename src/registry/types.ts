// Copyright 2023 Parity Technologies (UK) Ltd.

type ChainInfo = {
	[x: string]: {
		specName: string;
		tokens: string[];
	};
};

export type ChainInfoRegistry = {
	polkadot: ChainInfo;
	kusama: ChainInfo;
	westend: ChainInfo;
};
