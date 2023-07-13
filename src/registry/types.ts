// Copyright 2023 Parity Technologies (UK) Ltd.

import { ForeignAssetMultiLocation } from '../types';

export interface AssetsInfo {
	[key: string]: string;
}

export interface ForeignAssetsData {
	symbol: string;
	multiLocation: ForeignAssetMultiLocation[];
}

export interface ForeignAssetsInfo {
	[key: string]: ForeignAssetsData;
}

export interface ChainInfoKeys {
	specName: string;
	tokens: string[];
	assetsInfo: AssetsInfo;
	foreignAssetsInfo: ForeignAssetsInfo | {};
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
