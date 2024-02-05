// Copyright 2023-2024 Parity Technologies (UK) Ltd.

import { ASSET_HUB_CHAIN_ID } from '../consts';
import type { AssetTransferApiOpts } from '../types';
import type { ChainInfo, ChainInfoKeys, ChainInfoRegistry, InjectedChainInfoKeys } from './types';

const propertyIterator = (input: object, chain: ChainInfo<ChainInfoKeys>, id: string, property?: string) => {
	for (const [key, value] of Object.entries(input)) {
		if (Array.isArray(chain[id][key])) {
			if (typeof value === 'string' && !chain[id][key].includes(value)) {
				chain[id][key].push(value);
			} else if (typeof value === 'object') {
				const toStringVal = JSON.stringify(value);
				let tmp = chain[id][key] as Array<object>;
				let exists = false;
				tmp.forEach((v) => {
					 if (JSON.stringify(v) === toStringVal) exists = true;
				});
				if (!exists) chain[id][key].push(value);
			}
		} else if (property && property !== 'specName' && !chain[id][property][key]) {
			chain[id][property][key] = value as string;
		} else if (!property) {
			propertyIterator(value as object, chain, id, key);
		}
	}
};

const updateRegistry = (
	injectedChain: ChainInfo<InjectedChainInfoKeys>,
	registry: ChainInfoRegistry<ChainInfoKeys>,
	registryChain: string,
) => {
	const chain = registry[registryChain] as unknown as ChainInfo<ChainInfoKeys>;
	// I dont think defect is accurate here, what if the user passes in assetsInfo, and not tokens.
	const defect = {
		assetsInfo: {},
		foreignAssetsInfo: {},
		poolPairsInfo: {},
	};
	for (const id of Object.keys(injectedChain)) {
		if (!chain[id]) {
			Object.assign(injectedChain[id], defect);
			Object.assign(chain, injectedChain);
		}
		propertyIterator(injectedChain[id], chain, id);
	}
};

export const parseRegistry = (
	registry: ChainInfoRegistry<ChainInfoKeys>,
	assetsOpts: AssetTransferApiOpts<InjectedChainInfoKeys>,
): ChainInfoRegistry<ChainInfoKeys> => {
	if (assetsOpts.injectedRegistry) {
		const { injectedRegistry } = assetsOpts;
		const polkadot = injectedRegistry.polkadot;
		const kusama = injectedRegistry.kusama;
		const westend = injectedRegistry.westend;
		const rococo = injectedRegistry.rococo;

		if (polkadot) updateRegistry(polkadot, registry, 'polkadot');
		if (kusama) updateRegistry(kusama, registry, 'kusama');
		if (westend) updateRegistry(westend, registry, 'westend');
		if (rococo) updateRegistry(rococo, registry, 'rococo');
	}

	/**
	 * This is a temporary overwrite to ensure the statemine specName is not shared between
	 * kusama and rococo for their asset-hub chains.
	 */
	registry.rococo[ASSET_HUB_CHAIN_ID].specName = 'asset-hub-rococo';

	return registry;
};
