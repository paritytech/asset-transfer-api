// Copyright 2023 Parity Technologies (UK) Ltd.

import { SYSTEM_PARACHAINS_IDS } from '../../consts';
import { BaseError } from '../../errors';
import { findRelayChain, parseRegistry } from '../../registry';

/**
 * Returns the correct asset index for a valid system chain token symbol
 * errors if given an invalid symbol
 *
 * @param tokenSymbol string
 * @param specName string
 */
export const getSystemChainTokenSymbolGeneralIndex = (
	tokenSymbol: string,
	specName: string
): string => {
	const registry = parseRegistry({});
	const relayChain = findRelayChain(specName, registry);
	const { assetsInfo } = registry[relayChain][SYSTEM_PARACHAINS_IDS[0]];

	// get the corresponding asset id index from the assets registry
	const assetId: string | undefined = Object.keys(assetsInfo).find(
		(key) => assetsInfo[key].toLowerCase() === tokenSymbol.toLowerCase()
	);

	if (!assetId) {
		throw new BaseError(
			`general index for assetId ${tokenSymbol} was not found`
		);
	}

	return assetId;
};
