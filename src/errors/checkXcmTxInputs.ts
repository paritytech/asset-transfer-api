import { ChainInfo, ChainInfoRegistry } from 'src/registry/types';

import { findRelayChain } from '../registry/findRelayChain';
import type { IDirection } from '../types';
import { BaseError } from './BaseError';

/**
 * This will check the given assetIds and ensure they are either valid integers as strings
 * or known token symbols
 *
 * TODO: determine whether both native and foreign assets are in the list of assetIds
 *
 * @param assetIds
 * @param relayChainInfo
 * @param specName
 */
export const checkAssetIdInput = (
	assetIds: string[],
	relayChainInfo: ChainInfo,
	specName: string,
	destChainId: string
) => {
	for (let i = 0; i < assetIds.length; i++) {
		const assetId = assetIds[i];
		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		// check if parsed assetId is a valid number
		const notValidNumber = Number.isNaN(parsedAssetIdAsNumber);

		if (notValidNumber) {
			let isValidTokenSymbol = false;
			const chainInfo = relayChainInfo[destChainId];

			const isNativeChain =
				chainInfo.specName.toLowerCase() === specName.toLowerCase();

			// if chain specNames don't match throw an error
			if (!isNativeChain) {
				throw new BaseError(
					`non matching chains. Received: ${specName.toLowerCase()}. Expected: ${chainInfo.specName.toLowerCase()}`
				);
			}

			// check if assetId symbol exists within the chains registered tokens list
			for (const tokenSymbol of chainInfo.tokens) {
				// token is valid symbol on correct chain
				if (tokenSymbol === assetId) {
					isValidTokenSymbol = true;
				}
			}

			// if not valid token symbol throw an error
			if (!isValidTokenSymbol) {
				throw new BaseError(
					`'assetIds' must be either valid number or valid chain token symbols. Got: ${assetId}`
				);
			}
		}
	}
};

/**
 * This will check the given inputs and ensure there is no issues when constructing
 * the xcm transaction.
 *
 * TODO: This should be expanded upon and inputs may be added. This is just a base implementation.
 *
 * @param assetIds
 * @param amounts
 * @param xcmDirection
 */
export const checkXcmTxInputs = (
	assetIds: string[],
	amounts: string[],
	xcmDirection: IDirection,
	destChainId: string,
	specName: string,
	registry: ChainInfoRegistry
) => {
	const relayChainName = findRelayChain(specName, registry);
	const relayChainInfo: ChainInfo = registry[relayChainName];
	checkAssetIdInput(assetIds, relayChainInfo, specName, destChainId);

	const isRelayDirection = xcmDirection.toLowerCase().includes('relay');
	/**
	 * Lengths should match, and indicies between both the amounts and assetIds should match.
	 */
	if (assetIds.length !== amounts.length && !isRelayDirection) {
		throw new BaseError(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	}
};
