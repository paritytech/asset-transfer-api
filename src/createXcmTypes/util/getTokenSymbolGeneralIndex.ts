// Copyright 2023 Parity Technologies (UK) Ltd.

import { SYSTEM_PARACHAINS_IDS } from '../../consts';
import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { getChainIdBySpecName } from './getChainIdBySpecName';

/**
 * Returns the correct asset index for a valid system chain token symbol
 * errors if given an invalid symbol
 *
 * @param tokenSymbol string
 * @param specName string
 */
export const getSystemChainTokenSymbolGeneralIndex = (
	tokenSymbol: string,
	specName: string,
): string => {
	const newRegistry = new Registry(specName, {});

	const systemChainId = getChainIdBySpecName(newRegistry, specName);

	if (!SYSTEM_PARACHAINS_IDS.includes(systemChainId)) {
		throw new BaseError(
			`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`
		);
	}

	const { assetsInfo } = newRegistry.currentRelayRegistry[systemChainId];

	if (Object.keys(assetsInfo).length === 0) {
		throw new BaseError(
			`${specName} has no associated token symbol ${tokenSymbol}`
		);
	}

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
