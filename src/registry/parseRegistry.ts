// Copyright 2023 Parity Technologies (UK) Ltd.

import fetch from 'node-fetch';

import { ASSET_HUB_CHAIN_ID } from '../consts';
import type { AssetTransferApiOpts } from '../types';
import type { ChainInfoRegistry } from './types';

export const parseRegistry = async (assetsOpts: AssetTransferApiOpts): Promise<ChainInfoRegistry> => {
	const registry = (await (
		await fetch('https://paritytech.github.io/asset-transfer-api-registry/registry.json')
	).json()) as ChainInfoRegistry;

	if (assetsOpts.injectedRegistry) {
		const { injectedRegistry } = assetsOpts;
		const polkadot = injectedRegistry.polkadot;
		const kusama = injectedRegistry.kusama;
		const westend = injectedRegistry.westend;
		const rococo = injectedRegistry.rococo;

		if (polkadot) Object.assign(registry.polkadot, polkadot);
		if (kusama) Object.assign(registry.kusama, kusama);
		if (westend) Object.assign(registry.westend, westend);
		if (rococo) Object.assign(registry.rococo, rococo);
	}

	/**
	 * This is a temporary overwrite to ensure the statemine specName is not shared between
	 * kusama and rococo for their asset-hub chains.
	 */
	registry.rococo[ASSET_HUB_CHAIN_ID].specName = 'asset-hub-rococo';

	return registry;
};
