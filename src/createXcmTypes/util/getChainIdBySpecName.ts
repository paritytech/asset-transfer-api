// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { 
	POLKADOT_ASSET_HUB_SPEC_NAMES, 
	KUSAMA_ASSET_HUB_SPEC_NAMES, 
	WESTEND_ASSET_HUB_SPEC_NAMES 
} from '../../consts';
/**
 * returns a chains ID based on its relay chain and specName
 *
 * @param registry Registry
 * @param specName string
 * @returns
 */
export const getChainIdBySpecName = (
	registry: Registry,
	specName: string
): string => {
	let result = '';

	Object.entries(registry.currentRelayRegistry).forEach((chainInfo) => {
		if (chainInfo[1].specName.toLowerCase() === specName.toLowerCase()) {
			result = chainInfo[0];
		}
	});

	// if the specName isnt found in the registry, check against AssetHub specNames
	// to ensure updated specNames are accounted for
	if (result.length === 0) {
		if (
			POLKADOT_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
			KUSAMA_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
			WESTEND_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase())
		) {
			result = '1000';
		}
	}

	return result;
};
