// Copyright 2024 Parity Technologies (UK) Ltd.

import { RELAY_CHAIN_IDS } from '../../consts.js';
import { Registry } from '../../registry/index.js';

export const isRelayNativeAsset = (registry: Registry, assetId: string): boolean => {
	const relayChainId = RELAY_CHAIN_IDS[0];
	const { tokens } = registry.currentRelayRegistry[relayChainId];
	const originChainId = registry.lookupChainIdBySpecName(registry.specName);
	const originIsRelayChain = originChainId === relayChainId;

	// if assetId is an empty string treat it as the relay asset
	if (assetId === '') {
		return true;
	}

	if (originIsRelayChain && assetId === `{"parents":"0","interior":{"Here":""}}`) {
		return true;
	}

	if (!originIsRelayChain && assetId === `{"parents":"1","interior":{"Here":""}}`) {
		return true;
	}

	for (const token of tokens) {
		if (token.toLowerCase() === assetId.toLowerCase()) {
			return true;
		}
	}

	return false;
};
