// Copyright 2023-2024 Parity Technologies (UK) Ltd.

import { ASSET_HUB_CHAIN_ID } from '../consts';
import type { AssetTransferApiInjectedOpts } from '../types';
import type { ChainInfo, ChainInfoRegistry, InjectedChainInfo } from './types';

const updateRegistry = (injectedChain: InjectedChainInfo, registry: ChainInfoRegistry, registryChain: string) => {
	for (const key of Object.keys(injectedChain)) {
		const info = registry[registryChain] as unknown as ChainInfo;
		if (info[key] !== undefined) {
			Object.assign(info[key], injectedChain[key]);
		} else {
			for (const property of Object.keys(info[0])) {
				if (injectedChain[key][property] === undefined) {
					if (property === 'specName' || property === 'tokens') {
						throw Error(`Must define the ${property} property`);
					} else {
						injectedChain[key][property] = {};
					}
				}
				Object.assign(info, injectedChain);
			}
		}
	}
};

export const parseRegistry = (
	registry: ChainInfoRegistry,
	assetsOpts: AssetTransferApiInjectedOpts,
): ChainInfoRegistry => {
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
