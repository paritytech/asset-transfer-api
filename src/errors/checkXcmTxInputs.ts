import { findRelayChain } from '../registry/findRelayChain';
import type { ChainInfo, ChainInfoRegistry } from '../registry/types';
import type { IDirection } from '../types';
import { BaseError } from './BaseError';

/**
 * This will check the given assetIds and ensure they are either valid integers as strings
 * or known token symbols
 *
 * @param assetIds
 * @param relayChainInfo
 * @param specName
 * @param destChainId
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
		const notValidNumber = Number.isNaN(parsedAssetIdAsNumber);

		if (notValidNumber) {
			let isValidTokenSymbol = false;
			const chainInfo = relayChainInfo[destChainId];

			const isNativeChain =
				chainInfo.specName.toLowerCase() === specName.toLowerCase();

			if (!isNativeChain) {
				throw new BaseError(
					`non matching chains. Received: ${specName.toLowerCase()}. Expected: ${chainInfo.specName.toLowerCase()}`
				);
			}

			for (const tokenSymbol of chainInfo.tokens) {
				if (tokenSymbol.toUpperCase() === assetId.toUpperCase()) {
					isValidTokenSymbol = true;
				}
			}

			if (!isValidTokenSymbol) {
				throw new BaseError(
					`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: ${assetId}`
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
	/**
	 * Checks to ensure that assetId's are either valid integer numbers or native asset token symbols
	 */
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
