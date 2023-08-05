// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { isHex } from '@polkadot/util';
import { isEthereumAddress } from '@polkadot/util-crypto';

import {
	MAX_ASSETS_FOR_TRANSFER,
	RELAY_CHAIN_IDS,
	SYSTEM_PARACHAINS_IDS,
} from '../consts';
import { XcmPalletName } from '../createXcmCalls/util/establishXcmPallet';
import { CreateWeightLimitOpts } from '../createXcmTypes/types';
import { constructAssetHubApiPromise } from '../createXcmTypes/util/constructAssetHubApiPromise';
import { foreignAssetMultiLocationIsInRegistry } from '../createXcmTypes/util/foreignAssetMultiLocationIsInRegistry';
import { foreignAssetsMultiLocationExists } from '../createXcmTypes/util/foreignAssetsMultiLocationExists';
import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import { multiLocationAssetIsParachainsNativeAsset } from '../createXcmTypes/util/multiLocationAssetIsParachainsNativeAsset';
import { Registry } from '../registry';
import type { ChainInfo, ChainInfoKeys } from '../registry/types';
import { Direction } from '../types';
import { AssetInfo } from '../types';
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
 * Ensure when sending foreign asset tx's that the length of assetIds is not zero
 *
 * @param assetIds
 */
export const checkMultiLocationIdLength = (assetIds: string[]) => {
	if (assetIds.length === 0) {
		throw new BaseError('multilocation `assetIds` cannot be empty');
	}
};

/**
 * Ensure when sending foreign asset tx's that the length of amounts is not zero
 *
 * @param amounts
 */
export const checkMultiLocationAmountsLength = (amounts: string[]) => {
	if (amounts.length === 0) {
		throw new BaseError('multilocation `amounts` cannot be empty');
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
 * Ensures that foreign asset txs are not constructed when xcm pallet is xTokens
 *
 * @param xcmPallet
 * @param xcmDirection
 * @param isForeignAssetsTransfer
 */
export const checkParaToSystemIsNonForeignAssetXTokensTx = (
	xcmPallet: XcmPalletName,
	isForeignAssetsTransfer: boolean
) => {
	if (xcmPallet === XcmPalletName.xTokens && isForeignAssetsTransfer) {
		throw new BaseError(
			`ParaToSystem: xTokens pallet does not support foreign asset transfers`
		);
	}
};

/**
 * This will check that a given assetId is neither an empty string
 * or known blank space
 *
 * @param assetId
 */
const checkIfAssetIdIsBlankSpace = (assetId: string) => {
	// check if assetId is a blank space
	// if assetId is a space throw an error
	if (assetId.length > 0 && assetId.trim() === '') {
		throw new BaseError(`assetId cannot be blank spaces.`);
	}
};

/**
 *  checks if assetIds contain the current relay chains native asset
 *
 * @param assetIds string[]
 * @param relayChainAsset string
 * @returns boolean
 */
export const containsNativeRelayAsset = (
	assetIds: string[],
	relayChainAsset: string
): boolean => {
	// We assume when the assetId's input is empty that the native token is to be transferred.
	if (assetIds.length === 0) {
		return true;
	}

	for (let i = 0; i < assetIds.length; i++) {
		const assetId = assetIds[i];

		if (assetId.toLowerCase() === relayChainAsset.toLowerCase()) {
			return true;
		}
	}

	return false;
};

/**
 * if direction is SystemToSystem, assetIds should contain either only the relay chains
 * native asset or only assets native to the system chain and not both
 *
 * @param assetIds string[]
 * @param registry Registry
 */
export const checkIfNativeRelayChainAssetPresentInMultiAssetIdList = (
	assetIds: string[],
	registry: Registry
) => {
	const relayChainID = RELAY_CHAIN_IDS[0];
	const nativeRelayChainAsset =
		registry.currentRelayRegistry[relayChainID].tokens[0];

	if (
		assetIds.length > 1 &&
		containsNativeRelayAsset(assetIds, nativeRelayChainAsset)
	) {
		throw new BaseError(
			`Found the relay chains native asset in list ${assetIds.toString()}. assetIds list must be empty or only contain the relay chain asset for direction SystemToSystem`
		);
	}
};

/**
 * checks if a multilocation list contains all native or all foreign assets of the destChain
 * native and foreign assets to the dest chain cannot be mixed as it is either a reserve or teleport
 * throws an error if foreign and native assets are found
 *
 * @param destChainId
 * @param multiLocationAssetIds
 * @param isForeignAssetsTransfer
 * @returns boolean
 */
export const checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain = (
	xcmDirection: Direction,
	destChainId: string,
	multiLocationAssetIds: string[]
) => {
	if (multiLocationAssetIds.length > 1) {
		let foreignMultiLocationAssetFound = false;
		let nativeMultiLocationAssetFound = false;

		// iterate through list and determine if each asset is native to the dest parachain
		for (const multilocation of multiLocationAssetIds) {
			const isNativeToDestChain = multiLocationAssetIsParachainsNativeAsset(
				destChainId,
				multilocation
			);

			if (isNativeToDestChain) {
				nativeMultiLocationAssetFound = true;
			} else {
				foreignMultiLocationAssetFound = true;
			}

			if (nativeMultiLocationAssetFound && foreignMultiLocationAssetFound) {
				throw new BaseError(
					`${xcmDirection}: found both foreign and native multilocations in ${multiLocationAssetIds.toString()}. multilocation XCMs must only include either native or foreign assets of the destination chain`
				);
			}
		}
	}
};

/**
 * Checks that each multilocation string provided is of the proper format to create a MultiLocation
 * throws an error if the MultiLocation is unable to be created
 *
 * @param destChainId
 * @param multiLocationAssetIds
 * @param isForeignAssetsTransfer
 * @returns boolean
 */
export const checkAllMultiLocationAssetIdsAreValid = (
	api: ApiPromise,
	multiLocationAssetIds: string[]
) => {
	for (const multilocationId of multiLocationAssetIds) {
		try {
			api.registry.createType('MultiLocation', JSON.parse(multilocationId));
		} catch (error) {
			if ((error as Error).message.includes('Unexpected token')) {
				throw new BaseError((error as Error).message);
			} else if ((error as Error).message.includes('::')) {
				const errorInfo = (error as Error).message.split('::');
				const errorDetails = errorInfo[errorInfo.length - 2].concat(
					errorInfo[errorInfo.length - 1]
				);

				throw new BaseError(
					`Error creating MultiLocation type with multilocation string value ${multilocationId}: ${errorDetails}`
				);
			} else {
				throw new BaseError(
					`Error creating multilocation type: ${(error as Error).message}`
				);
			}
		}
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

	// if an empty string is passed, treat it as the native relay asset
	if (assetId === '') {
		assetIsRelayChainNativeAsset = true;
	}

	if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
		assetIsRelayChainNativeAsset = true;
	}

	if (!assetIsRelayChainNativeAsset) {
		throw new BaseError(
			`RelayToSystem: asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`
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

	// if an empty string is passed, treat it as the native relay asset
	if (assetId === '') {
		assetIsRelayChainNativeAsset = true;
	}

	if (typeof assetId === 'string') {
		if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
			assetIsRelayChainNativeAsset = true;
		}
	}

	if (!assetIsRelayChainNativeAsset) {
		throw new BaseError(
			`RelayToPara: asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`
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

	// if an empty string is passed, treat it as the native relay asset
	if (assetId === '') {
		matchedRelayChainNativeToken = true;
	}

	if (typeof assetId === 'string') {
		if (relayChainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
			matchedRelayChainNativeToken = true;
		}
	}

	if (!matchedRelayChainNativeToken) {
		throw new BaseError(
			`SystemToRelay: assetId ${assetId} not native to ${relayChain.specName}. Expected ${relayChainNativeAsset}`
		);
	}
};

const checkSystemAssets = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	systemParachainInfo: ChainInfoKeys,
	registry: Registry,
	xcmDirection: string,
	isForeignAssetsTransfer: boolean
) => {
	if (isForeignAssetsTransfer) {
		// check that the asset id is a valid multilocation
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInRegistry(
			api,
			assetId,
			registry
		);

		if (!multiLocationIsInRegistry) {
			// get AssetHub ApiPromise to query foreign assets pallet
			const assetHubApi = await constructAssetHubApiPromise(registry);

			const isValidForeignAsset = await foreignAssetsMultiLocationExists(
				assetHubApi,
				assetId
			);

			await assetHubApi.disconnect();

			if (!isValidForeignAsset) {
				throw new BaseError(`ForeignAssets MultiLocation ${assetId} not found`);
			}
		}
	} else {
		// check if assetId is a number
		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const invalidNumber = Number.isNaN(parsedAssetIdAsNumber);

		if (!invalidNumber) {
			// assetId is a valid number
			// ensure the assetId exists as an asset on the system parachain
			const assetSymbol: string | undefined =
				systemParachainInfo.assetsInfo[assetId];

			if (assetSymbol === undefined) {
				// if asset is not in registry, query the assets pallet to see if it has a value
				const asset = await api.query.assets.asset(assetId);

				// if asset is found in the assets pallet, return LocalTxType Assets
				if (asset.isNone) {
					throw new BaseError(
						`${xcmDirection}: integer assetId ${assetId} not found in ${specName}`
					);
				}
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

			if (assetId === '') {
				isValidTokenSymbol = true;
			}

			// if no native token for the system parachain was matched, throw an error
			if (!isValidTokenSymbol) {
				throw new BaseError(
					`${xcmDirection}: assetId ${assetId} not found for system parachain ${specName}`
				);
			}
		}
	}
};

/**
 * This will check the given assetId and validate it in either string integer, or string symbol format
 *
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkSystemToParaAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo,
	registry: Registry,
	xcmDirection: Direction,
	isForeignAssetsTransfer: boolean
) => {
	await checkIsValidSystemChainAssetId(
		api,
		assetId,
		specName,
		relayChainInfo,
		registry,
		xcmDirection,
		isForeignAssetsTransfer
	);
};

export const checkIsValidSystemChainAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo,
	registry: Registry,
	xcmDirection: Direction,
	isForeignAssetsTransfer: boolean
) => {
	const systemChainId = getChainIdBySpecName(registry, specName);
	const systemParachainInfo = relayChainInfo[systemChainId];

	if (typeof assetId === 'string') {
		await checkSystemAssets(
			api,
			assetId,
			specName,
			systemParachainInfo,
			registry,
			xcmDirection,
			isForeignAssetsTransfer
		);
	}
};

/**
 * The current functionality of ParaToSystem requires the passed in assets to be
 * in the format to which it is stored in the corresponding system parachain.
 * Therefore we can share the same functionality as SystemToPara.
 *
 * @param assetId
 * @param specName
 * @param relayChainInfo
 */
const checkParaToSystemAssetId = async (
	api: ApiPromise,
	assetId: string,
	relayChainInfo: ChainInfo,
	registry: Registry,
	isForeignAssetsTransfer: boolean
) => {
	const systemParachainId = SYSTEM_PARACHAINS_IDS[0];
	const systemParachainInfo = relayChainInfo[systemParachainId];
	const systemSpecName = systemParachainInfo.specName;

	if (typeof assetId === 'string') {
		// An assetId may be a hex value to represent a GeneralKey for erc20 tokens.
		// These will be represented as Foreign Assets in regard to its MultiLocation
		if (isHex(assetId)) {
			const ethAddr = isEthereumAddress(assetId);
			if (!ethAddr) {
				throw new BaseError(
					`ParaToSystem: assetId ${assetId}, is not a valid erc20 token.`
				);
			}

			return;
		}

		await checkSystemAssets(
			api,
			assetId,
			systemSpecName,
			systemParachainInfo,
			registry,
			'ParaToSystem',
			isForeignAssetsTransfer
		);
	}
};

/**
 * This will check the given assetId and ensure that it is a valid system chain asset or relay chain native token
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkSystemToSystemAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo,
	registry: Registry,
	xcmDirection: Direction,
	isForeignAssetsTransfer: boolean
) => {
	await checkIsValidSystemChainAssetId(
		api,
		assetId,
		specName,
		relayChainInfo,
		registry,
		xcmDirection,
		isForeignAssetsTransfer
	);
};

/**
 * Checks to ensure that assetId's have a length no greater than MAX_ASSETS_FOR_TRANSFER, throws an error if greater than MAX_ASSETS_FOR_TRANSFER
 *
 * @param assetIds
 */
export const checkAssetIdsLengthIsValid = (assetIds: string[]) => {
	if (assetIds.length > MAX_ASSETS_FOR_TRANSFER) {
		throw new BaseError(
			`Maximum number of assets allowed for transfer is 2. Found ${assetIds.length} assetIds`
		);
	}
};

/**
 * Checks to ensure that assetId's have no duplicates, throws an error if duplicate is found
 *
 * @param assetIds
 */
export const checkAssetIdsHaveNoDuplicates = (assetIds: string[]) => {
	const duplicateAssetIds: string[] = [];

	if (assetIds.length > 1) {
		for (let i = 0; i < assetIds.length; i++) {
			const asset1 = assetIds[i];

			for (let j = 0; j < assetIds.length; j++) {
				if (i === j) {
					continue;
				}

				const asset2 = assetIds[j];
				if (
					asset1.trim().toLowerCase().replace(/ /g, '') ===
					asset2.trim().toLowerCase().replace(/ /g, '')
				) {
					duplicateAssetIds.push(asset2);
				}
			}
		}

		if (duplicateAssetIds.length > 0) {
			if (assetIds[0] === '') {
				throw new BaseError(
					`AssetIds must be unique. Found duplicate native relay assets as empty strings`
				);
			}

			throw new BaseError(
				`AssetIds must be unique. Found duplicate assetId ${duplicateAssetIds[0]}`
			);
		}
	}
};

/**
 * Checks to ensure that assetId's are symbols, integers and empty string or multilocations exclusively
 *
 * @param assetIds
 */
export const checkAssetIdsAreOfSameAssetIdType = (assetIds: string[]) => {
	if (assetIds.length > 1) {
		let relayDefaultValueFound = false;
		let symbolAssetIdFound = '';
		let integerAssetIdFound = '';
		let multiLocationAssetIdFound = '';

		for (const assetId of assetIds) {
			if (assetId === '') {
				relayDefaultValueFound = true;
				continue;
			}

			const parsedAssetIdAsNumber = Number.parseInt(assetId);
			const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);

			if (!isNotANumber) {
				integerAssetIdFound = assetId;
			} else if (assetId.toLowerCase().includes('parents')) {
				multiLocationAssetIdFound = assetId;
			} else {
				symbolAssetIdFound = assetId;
			}
		}

		if (relayDefaultValueFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both default relay native asset and foreign asset with assetId: ${multiLocationAssetIdFound}. Relay native asset and foreign assets can't be transferred within the same call.`
			);
		}

		if (integerAssetIdFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both native asset with assetID ${integerAssetIdFound} and foreign asset with assetId ${multiLocationAssetIdFound}. Native assets and foreign assets can't be transferred within the same call.`
			);
		}

		if (symbolAssetIdFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both symbol ${symbolAssetIdFound} and multilocation assetId ${multiLocationAssetIdFound}. Asset Ids must be symbol and integer or multilocation exclusively.`
			);
		}
	}
};

/**
 * Checks to ensure that the xcmVersion is at least 3 if paysWithFeeDest is provided
 *
 * @param xcmVersion
 * @param paysWithFeeDest
 */
export const checkXcmVersionIsValidForPaysWithFeeDest = (
	xcmDirection: Direction,
	xcmVersion?: number,
	paysWithFeeDest?: string
) => {
	if (
		xcmDirection != Direction.ParaToSystem &&
		xcmDirection != Direction.ParaToPara &&
		paysWithFeeDest &&
		xcmVersion &&
		xcmVersion < 3
	) {
		throw new BaseError('paysWithFeeDest requires XCM version 3');
	}
};

/**
 * This will check the given assetIds and ensure they are either valid integers as strings
 * or known token symbols
 *
 * @param assetIds
 * @param relayChainInfo
 * @param specName
 * @param xcmDirection
 * @param registry
 */
export const checkAssetIdInput = async (
	api: ApiPromise,
	assetIds: string[],
	relayChainInfo: ChainInfo,
	specName: string,
	xcmDirection: Direction,
	registry: Registry,
	isForeignAssetsTransfer: boolean
) => {
	for (let i = 0; i < assetIds.length; i++) {
		const assetId = assetIds[i];

		checkIfAssetIdIsBlankSpace(assetId);

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
			await checkSystemToParaAssetId(
				api,
				assetId,
				specName,
				relayChainInfo,
				registry,
				xcmDirection,
				isForeignAssetsTransfer
			);
		}

		if (xcmDirection === Direction.SystemToSystem) {
			await checkSystemToSystemAssetId(
				api,
				assetId,
				specName,
				relayChainInfo,
				registry,
				xcmDirection,
				isForeignAssetsTransfer
			);
		}

		if (xcmDirection === Direction.ParaToSystem) {
			await checkParaToSystemAssetId(
				api,
				assetId,
				relayChainInfo,
				registry,
				isForeignAssetsTransfer
			);
		}
	}
};

/**
 * This will check isLimited and ensure that both refTime and proofSize are
 * provided if it is true
 *
 * @param isLimiited
 * @param refTime
 * @param proofSize
 */
export const checkWeightLimit = (opts: CreateWeightLimitOpts) => {
	if (opts.isLimited) {
		if (!opts.refTime) {
			throw new BaseError(
				'refTime value not found for weight limited transaction. Please provide refTime value'
			);
		}

		if (!opts.proofSize) {
			throw new BaseError(
				'proofSize value not found for weight limited transaction. Please provide proofSize value'
			);
		}
	}
};

/**
 * This will check the given inputs and ensure there is no issues when constructing
 * the xcm transaction.
 *
 * @param assetIds
 * @param amounts
 * @param xcmDirection
 * @param specName
 * @param registry
 */
export const checkXcmTxInputs = async (
	api: ApiPromise,
	destChainId: string,
	assetIds: string[],
	amounts: string[],
	xcmDirection: Direction,
	xcmPallet: XcmPalletName,
	specName: string,
	registry: Registry,
	opts: CreateWeightLimitOpts,
	isForeignAssetsTransfer: boolean,
	xcmVersion?: number,
	paysWithFeeDest?: string
) => {
	const relayChainInfo = registry.currentRelayRegistry;

	checkXcmVersionIsValidForPaysWithFeeDest(
		xcmDirection,
		xcmVersion,
		paysWithFeeDest
	);

	/**
	 * Checks to ensure that assetId's have a length no greater than MAX_ASSETS_FOR_TRANSFER
	 */
	checkAssetIdsLengthIsValid(assetIds);

	/**
	 * Checks to ensure that assetId's have no duplicate values
	 */
	checkAssetIdsHaveNoDuplicates(assetIds);

	/**
	 * Checks to ensure that assetId's are either empty string, symbol and integer values or multilocations
	 */
	checkAssetIdsAreOfSameAssetIdType(assetIds);

	/**
	 * Checks to ensure that assetId's are either valid integer numbers or native asset token symbols
	 */
	await checkAssetIdInput(
		api,
		assetIds,
		relayChainInfo,
		specName,
		xcmDirection,
		registry,
		isForeignAssetsTransfer
	);
	checkWeightLimit(opts);
	await checkAssetIdInput(
		api,
		assetIds,
		relayChainInfo,
		specName,
		xcmDirection,
		registry,
		isForeignAssetsTransfer
	);

	if (xcmDirection === Direction.RelayToSystem) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === Direction.RelayToPara) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === Direction.SystemToRelay) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (xcmDirection === Direction.SystemToPara) {
		if (isForeignAssetsTransfer) {
			checkMultiLocationIdLength(assetIds);
			checkMultiLocationAmountsLength(amounts);
			checkAssetsAmountMatch(assetIds, amounts);
			checkAllMultiLocationAssetIdsAreValid(api, assetIds);
			checkAssetsAmountMatch(assetIds, amounts);
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(
				xcmDirection,
				destChainId,
				assetIds
			);
		}
		checkAssetsAmountMatch(assetIds, amounts);
	}

	if (xcmDirection === Direction.SystemToSystem) {
		if (isForeignAssetsTransfer) {
			checkMultiLocationIdLength(assetIds);
			checkMultiLocationAmountsLength(amounts);
			checkAssetsAmountMatch(assetIds, amounts);
			checkAllMultiLocationAssetIdsAreValid(api, assetIds);
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(
				xcmDirection,
				destChainId,
				assetIds
			);
		}
		checkIfNativeRelayChainAssetPresentInMultiAssetIdList(assetIds, registry);
	}

	if (xcmDirection === Direction.ParaToSystem) {
		checkParaToSystemIsNonForeignAssetXTokensTx(
			xcmPallet,
			isForeignAssetsTransfer
		);
		checkAssetsAmountMatch(assetIds, amounts);
	}
};
