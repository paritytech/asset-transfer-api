import { RELAY_CHAIN_IDS, SYSTEM_PARACHAINS_IDS } from '../consts';
import { Registry } from '../registry';
import type { ChainInfo } from '../registry/types';
import { Direction } from '../types';
import { BaseError } from './BaseError';

/**
 * Ensure when sending tx's to or from the relay chain that the length of the assetIds array
 * is zero or 1, and contains the correct token.
 *
 * @param assetIds
 */
export const checkRelayAssetIdLength = (assetIds: string[]) => {
	if (assetIds.length > 1) {
		throw new BaseError(
			"`assetIds` should be empty or length 1 when sending tx's to or from the relay chain."
		);
	}
};

/**
 * Ensure when sending tx's to or from the relay chain that the length of the amounts array is
 * eqaul to 1
 *
 * @param amounts
 */
export const checkRelayAmountsLength = (amounts: string[]) => {
	if (amounts.length !== 1) {
		throw new BaseError(
			'`amounts` should be of length 1 when sending to or from a relay chain'
		);
	}
};

/**
 * Ensure that both the assetIds array and amounts array match in length
 *
 * @param assetIds
 * @param amounts
 */
export const checkAssetsAmountMatch = (
	assetIds: string[],
	amounts: string[]
) => {
	if (assetIds.length !== amounts.length) {
		throw new BaseError(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	}
};

/**
 * This will check that a given assetId is neither an empty string
 * or known blank space
 *
 * @param assetId
 */
const checkIfAssetIdIsEmptyOrBlankSpace = (assetId: string) => {
	// check if empty or space
	// if assetId is an empty space or space error
	if (assetId === '' || assetId.trim() === '') {
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
			`Relay to Para: asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`
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
			`System to Relay: assetId ${assetId} not native to ${relayChain.specName}. Expected ${relayChainNativeAsset}`
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
					`System to Para: integer assetId ${assetId} not found in ${specName}`
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

			type AssetInfo = {
				id: string;
				symbol: string;
			};
			const tokenSymbolsMatched: AssetInfo[] = [];

			// if not found in system parachains tokens, check its assetsInfo
			if (!isValidTokenSymbol) {
				for (const [id, symbol] of Object.entries(
					systemParachainInfo.assetsInfo
				)) {
					if (symbol.toLowerCase() === assetId.toLowerCase()) {
						const assetInfo: AssetInfo = {
							id,
							symbol,
						};
						tokenSymbolsMatched.push(assetInfo);
					}
				}
			}

			// check if multiple matches found
			// if more than 1 match is found throw an error and include details on the matched tokens
			if (tokenSymbolsMatched.length > 1) {
				const assetMessageInfo = tokenSymbolsMatched.map(
					(token) => `assetId: ${token.id} symbol: ${token.symbol}`
				);
				const message =
					`Multiple assets found with symbol ${assetId}:\n${assetMessageInfo.toString()}\nPlease retry using an assetId rather than the token symbol
				`
						.trim()
						.replace(',', '\n');

				throw new BaseError(message);
			} else if (tokenSymbolsMatched.length === 1) {
				isValidTokenSymbol = true;
			}

			// if no native token for the system parachain was matched, throw an error
			if (!isValidTokenSymbol) {
				throw new BaseError(
					`System to Para: assetId ${assetId} not found for system parachain ${specName}`
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
	registry: Registry
) => {
	const relayChainInfo = registry.currentRelayRegistry;
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

	if (xcmDirection === 'RelayToSystem') {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === 'RelayToPara') {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === 'SystemToRelay') {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === 'SystemToPara') {
		checkAssetsAmountMatch(assetIds, amounts);
	}
};
