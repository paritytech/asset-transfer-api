// Copyright 2023-2024 Parity Technologies (UK) Ltd.

import { ASSET_HUB_CHAIN_ID } from '../consts';
import type { AssetTransferApiOpts } from '../types';
import type { ChainInfo, ChainInfoKeys, ChainInfoRegistry, InjectedChainInfoKeys } from './types';

const updateRegistry = (
	injectedChain: ChainInfo<InjectedChainInfoKeys>,
	registry: ChainInfoRegistry<ChainInfoKeys>,
	registryChain: string,
) => {
	const chain = registry[registryChain] as unknown as ChainInfo<ChainInfoKeys>;
	const defect = {
		assetsInfo: {},
		foreignAssetsInfo: {},
		poolPairsInfo: {},
	};
	for (const id of Object.keys(injectedChain)) {
		if (chain[id]) {
			for (const [property, value] of Object.entries(injectedChain[id])) {
				if (property === 'tokens') {
					for (const v of value) {
						if (!chain[id][property].includes(v as string)) {
							chain[id][property].push(v as string);
						}
					}
				} else if (property !== 'specName') {
					for (const [member, value] of Object.entries(injectedChain[id][property] as string[])) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						if (chain[id][property][member]) {
							continue;
						} else {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							chain[id][property][member] = value;
						}
					}
				}
			}
		} else {
			Object.assign(injectedChain[id], defect);
			Object.assign(chain, defect, injectedChain);
		}
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
