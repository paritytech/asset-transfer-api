import { SYSTEM_PARACHAINS_IDS } from '../consts';
import { findRelayChain } from '../registry/findRelayChain';
import type { ChainInfo, ChainInfoRegistry } from '../registry/types';
import type { Direction } from '../types';
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
	destChainId: string,
	xcmDirection: Direction
) => {
	for (let i = 0; i < assetIds.length; i++) {
		const assetId = assetIds[i];
		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const invalidNumber = Number.isNaN(parsedAssetIdAsNumber);

		// check that the specific assetId exists for the destChain
		if (!invalidNumber) {
			if (xcmDirection.toLowerCase().startsWith('system')) {
				const systemParachainId = SYSTEM_PARACHAINS_IDS[0];
				const chainInfo = relayChainInfo[systemParachainId];
				let isValidAssetId = false;

				for (const id of chainInfo.assetIds) {
					if (id === parsedAssetIdAsNumber) {
						isValidAssetId = true;
						break;
					}
				}

				if (!isValidAssetId) {
					throw new BaseError(`assetId ${assetId} not found in ${specName}`);
				}
			} else {
				// if the asset id is a valid number and the chain isn't a system parachain throw an error
				throw new BaseError(
					`integer assetId's can only be used for transfers from system parachains. Expected a valid token symbol. Got ${parsedAssetIdAsNumber}`
				);
			}
		}

		if (invalidNumber) {
			let isValidTokenSymbol = false;
			const chainInfo = relayChainInfo[destChainId];

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
	xcmDirection: Direction,
	destChainId: string,
	specName: string,
	registry: ChainInfoRegistry
) => {
	const relayChainName = findRelayChain(specName, registry);
	const relayChainInfo: ChainInfo = registry[relayChainName];
	/**
	 * Ensure that tx's originating from the relay chain should have no assets attached to the assetId's
	 */
	if (xcmDirection.toLowerCase().startsWith('relay') && assetIds.length > 0) {
		throw new BaseError(
			"`assetIds` should be empty when sending tx's from the relay chain."
		);
	}
	/**
	 * Checks to ensure that assetId's are either valid integer numbers or native asset token symbols
	 */
	checkAssetIdInput(
		assetIds,
		relayChainInfo,
		specName,
		destChainId,
		xcmDirection
	);

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
