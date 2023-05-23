import { RELAY_CHAIN_IDS, SYSTEM_PARACHAINS_IDS } from '../consts';
import { findRelayChain } from '../registry/findRelayChain';
import type { ChainInfo, ChainInfoRegistry } from '../registry/types';
import { Direction } from '../types';
import { BaseError } from './BaseError';

/**
 * This will check that a given assetId is neither an empty string
 * or known blank space
 *
 * @param assetId
 */
const checkIfAssetIdIsEmptyOrBlankSpace = (assetId: string) => {
	// check if empty or space
	// if assetId is an empty space or space error
	if (assetId === '' || assetId === ' ') {
		const assetIdLength = assetId.length;
		const errorMessageDetails =
			assetIdLength > 0 ? 'Found blank space' : 'Found empty string';

		throw new BaseError(
			`assetId cannot be blank spaces or empty. ${errorMessageDetails}`
		);
	}
};
/**
 * This will check the given assetId and ensure that it is the native token of the relay chain
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkRelayToSystemAssetId = (
	assetId: string,
	relayChainInfo: ChainInfo
) => {
	const relayChainId = RELAY_CHAIN_IDS[0];
	const relayChain = relayChainInfo[relayChainId];
	const relayChainNativeAsset = relayChain.tokens[0];

	// relay chain can only send its native asset
	// ensure the asset being sent is the native asset of the relay chain
	// no need to check if id is a number, if it is, it fails the check by default
	let assetIsRelayChainNativeAsset = false;
	if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
		assetIsRelayChainNativeAsset = true;
	}

	if (!assetIsRelayChainNativeAsset) {
		throw new BaseError(
			`Relay to System: asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`
		);
	}
};

/**
 * This will check the given assetId and ensure that it is the native token of the relay chain
 *
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkRelayToParaAssetId = (
	assetId: string,
	relayChainInfo: ChainInfo
) => {
	const relayChainId = RELAY_CHAIN_IDS[0];
	const relayChain = relayChainInfo[relayChainId];
	const relayChainNativeAsset = relayChain.tokens[0];

	// relay chain can only send its native asset
	// ensure the asset being sent is the native asset of the relay chain
	// no need to check if id is a number, if it is, it fails the check by default
	let assetIsRelayChainNativeAsset = false;
	if (typeof assetId === 'string') {
		if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
			assetIsRelayChainNativeAsset = true;
		}
	}

	if (!assetIsRelayChainNativeAsset) {
		throw new BaseError(
			`Relay to System: asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`
		);
	}
};
/**
 * This will check the given assetId and ensure that it is the native token of the relay chain
 *
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkSystemToRelayAssetId = (
	assetId: string,
	relayChainInfo: ChainInfo
) => {
	const relayChainId = RELAY_CHAIN_IDS[0];
	const relayChain = relayChainInfo[relayChainId];
	const relayChainNativeAsset = relayChain.tokens[0];

	// ensure assetId is relay chain's native token
	let matchedRelayChainNativeToken = false;

	if (typeof assetId === 'string') {
		if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
			matchedRelayChainNativeToken = true;
		}
	}

	if (!matchedRelayChainNativeToken) {
		throw new BaseError(
			`assetId ${assetId} not native to ${relayChain.specName}. Expected ${relayChainNativeAsset}`
		);
	}
};
/**
 * This will check the given assetId and validate it in either string integer, or string symbol format
 *
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkSystemToParaAssetId = (
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo
) => {
	const systemParachainId = SYSTEM_PARACHAINS_IDS[0];
	const systemParachainInfo = relayChainInfo[systemParachainId];

	if (typeof assetId === 'string') {
		// check if assetId is a number
		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const invalidNumber = Number.isNaN(parsedAssetIdAsNumber);

		if (!invalidNumber) {
			// assetId is a valid number
			// ensure the assetId exists as an asset on the system parachain
			const assetSymbol: string | undefined =
				systemParachainInfo.assetsInfo[assetId];

			if (assetSymbol === undefined) {
				throw new BaseError(
					`integer assetId ${assetId} not found in ${specName}`
				);
			}
		} else {
			// not a valid number
			// check if id is a valid token symbol of the system parachain chain
			let isValidTokenSymbol = false;

			// ensure character string is valid symbol for the system chain
			for (const token of systemParachainInfo.tokens) {
				if (token.toLowerCase() === assetId.toLowerCase()) {
					isValidTokenSymbol = true;
					break;
				}
			}

			// if not found in system parachains tokens, check its assetsInfo
			if (!isValidTokenSymbol) {
				for (const symbol of Object.values(systemParachainInfo.assetsInfo)) {
					if (symbol.toLowerCase() === assetId.toLowerCase()) {
						isValidTokenSymbol = true;
						break;
					}
				}
			}

			// if no native token for the system parachain was matched, throw an error
			if (!isValidTokenSymbol) {
				throw new BaseError(
					`assetId ${assetId} not found for system parachain ${specName}`
				);
			}
		}
	}
};

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
	_destChainId: string,
	xcmDirection: Direction
) => {
	for (let i = 0; i < assetIds.length; i++) {
		const assetId = assetIds[i];
		// check if assetId is empty string or blank space
		checkIfAssetIdIsEmptyOrBlankSpace(assetId);

		if (xcmDirection === Direction.RelayToSystem) {
			checkRelayToSystemAssetId(assetId, relayChainInfo);
		}

		if (xcmDirection === Direction.RelayToPara) {
			checkRelayToParaAssetId(assetId, relayChainInfo);
		}

		if (xcmDirection === Direction.SystemToRelay) {
			checkSystemToRelayAssetId(assetId, relayChainInfo);
		}

		if (xcmDirection === Direction.SystemToPara) {
			checkSystemToParaAssetId(assetId, specName, relayChainInfo);
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
