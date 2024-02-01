// Copyright 2023 Parity Technologies (UK) Ltd.

import { ASSET_HUB_CHAIN_ID } from '../consts';
import type { AssetTransferApiOpts } from '../types';
import type { ChainInfoRegistry } from './types';

export const parseRegistry = (registry: ChainInfoRegistry, assetsOpts: AssetTransferApiOpts): ChainInfoRegistry => {
	if (assetsOpts.injectedRegistry) {
		const { injectedRegistry } = assetsOpts;
		const polkadot = injectedRegistry.polkadot;
		const kusama = injectedRegistry.kusama;
		const westend = injectedRegistry.westend;
		const rococo = injectedRegistry.rococo;

		if (polkadot) {
			for (const key of Object.keys(polkadot)) {
				registry.polkadot[key] !== undefined
					? Object.assign(registry.polkadot[key], polkadot[key])
					: Object.assign(registry.polkadot, polkadot);
			}
		}

		if (kusama) {
			for (const key of Object.keys(kusama)) {
				registry.kusama[key] !== undefined
					? Object.assign(registry.kusama[key], kusama[key])
					: Object.assign(registry.kusama, kusama);
			}
		}

		if (westend) {
			for (const key of Object.keys(westend)) {
				registry.westend[key] !== undefined
					? Object.assign(registry.westend[key], westend[key])
					: Object.assign(registry.westend, westend);
			}
		}

		if (rococo) {
			for (const key of Object.keys(rococo)) {
				registry.rococo[key] !== undefined
					? Object.assign(registry.rococo[key], rococo[key])
					: Object.assign(registry.rococo, rococo);
			}
		}
	}

	/**
	 * This is a temporary overwrite to ensure the statemine specName is not shared between
	 * kusama and rococo for their asset-hub chains.
	 */
	registry.rococo[ASSET_HUB_CHAIN_ID].specName = 'asset-hub-rococo';

	return registry;
};
