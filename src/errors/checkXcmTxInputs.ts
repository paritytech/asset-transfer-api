// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { isHex } from '@polkadot/util';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { MAX_ASSETS_FOR_TRANSFER, RELAY_CHAIN_IDS } from '../consts';
import { XcmPalletName } from '../createXcmCalls/util/establishXcmPallet';
import { foreignAssetMultiLocationIsInCacheOrRegistry } from '../createXcmTypes/util/foreignAssetMultiLocationIsInCacheOrRegistry';
import { foreignAssetsMultiLocationExists } from '../createXcmTypes/util/foreignAssetsMultiLocationExists';
import { getGlobalConsensusSystemName } from '../createXcmTypes/util/getGlobalConsensusSystemName';
import { isParachainPrimaryNativeAsset } from '../createXcmTypes/util/isParachainPrimaryNativeAsset';
import { multiLocationAssetIsParachainsNativeAsset } from '../createXcmTypes/util/multiLocationAssetIsParachainsNativeAsset';
import { Registry } from '../registry';
import type { ChainInfo, ChainInfoKeys } from '../registry/types';
import type { XcmBaseArgsWithPallet } from '../types';
import { AssetInfo, Direction } from '../types';
import { validateNumber } from '../validate';
import { BaseError, BaseErrorsEnum } from './BaseError';
import type { CheckXcmTxInputsOpts } from './types';

/**
 * Ensure when sending tx's to or from the relay chain that the length of the assetIds array
 * is zero or 1, and contains the correct token.
 *
 * @param assetIds
 */
export const checkRelayAssetIdLength = (assetIds: string[]) => {
	if (assetIds.length > 1) {
		throw new BaseError(
			"`assetIds` should be empty or length 1 when sending tx's to or from the relay chain.",
			BaseErrorsEnum.InvalidInput,
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
			'`amounts` should be of length 1 when sending to or from a relay chain',
			BaseErrorsEnum.InvalidInput,
		);
	}
};

/**
 * Ensure when sending a parachain primary native asset that the length of the assetIds array is 0 or 1
 *
 * @param assetIds
 */
export const checkParaPrimaryAssetAssetIdsLength = (assetIds: string[]) => {
	if (assetIds.length > 1) {
		throw new BaseError(
			'`assetIds` should be of length 1 when sending a primary native parachain asset',
			BaseErrorsEnum.InvalidInput,
		);
	}
};

/**
 * Ensure when sending a parachain primary native asset that the length of the amounts array is
 * eqaul to 1
 *
 * @param amounts
 */
export const checkParaPrimaryAssetAmountsLength = (amounts: string[]) => {
	if (amounts.length !== 1) {
		throw new BaseError(
			'`amounts` should be of length 1 when sending a primary native parachain asset',
			BaseErrorsEnum.InvalidInput,
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
		throw new BaseError('multilocation `assetIds` cannot be empty', BaseErrorsEnum.InvalidInput);
	}
};

/**
 * Ensure when sending foreign asset tx's that the length of amounts is not zero
 *
 * @param amounts
 */
export const checkMultiLocationAmountsLength = (amounts: string[]) => {
	if (amounts.length === 0) {
		throw new BaseError('multilocation `amounts` cannot be empty', BaseErrorsEnum.InvalidInput);
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
	amounts: string[],
	isParachainPrimaryNativeAsset?: boolean,
) => {
	if (!isParachainPrimaryNativeAsset && assetIds.length !== amounts.length) {
		throw new BaseError(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.',
			BaseErrorsEnum.InvalidInput,
		);
	}
};

/**
 * Ensures that foreign asset txs are not constructed when xcm pallet is xTokens
 *
 * @param xcmPallet
 * @param isForeignAssetsTransfer
 */
export const CheckXTokensPalletOriginIsNonForeignAssetTx = (
	xcmDirection: Direction,
	xcmPallet: XcmPalletName,
	isForeignAssetsTransfer: boolean,
) => {
	if ((xcmPallet === XcmPalletName.xTokens || xcmPallet === XcmPalletName.xtokens) && isForeignAssetsTransfer) {
		throw new BaseError(
			`(${xcmDirection}) xTokens pallet does not support foreign asset transfers`,
			BaseErrorsEnum.InvalidPallet,
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
	// check if assetId is a blank space, if it is, throw an error
	if (assetId.length > 0 && assetId.trim() === '') {
		throw new BaseError(`assetId cannot be blank spaces.`, BaseErrorsEnum.InvalidInput);
	}
};

/**
 * Checks if assetIds contain the current relay chains native asset
 *
 * @param assetIds string[]
 * @param relayChainAsset string
 * @returns boolean
 */
export const containsNativeRelayAsset = (assetIds: string[], relayChainAsset: string): boolean => {
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
 * If the direction is SystemToSystem, assetIds should contain either only the relay chains
 * native asset or only assets native to the system chain and not both
 *
 * @param assetIds string[]
 * @param registry Registry
 */
export const checkIfNativeRelayChainAssetPresentInMultiAssetIdList = (assetIds: string[], registry: Registry) => {
	const relayChainID = RELAY_CHAIN_IDS[0];
	const nativeRelayChainAsset = registry.currentRelayRegistry[relayChainID].tokens[0];

	if (assetIds.length > 1 && containsNativeRelayAsset(assetIds, nativeRelayChainAsset)) {
		throw new BaseError(
			`Found the relay chains native asset in list [${assetIds.toString()}]. \`assetIds\` list must be empty or only contain the relay chain asset for direction SystemToSystem when sending the relay chains native asset.`,
			BaseErrorsEnum.InvalidInput,
		);
	}
};

/**
 * Checks if a multilocation list contains all native or all foreign assets of the destChain
 * native and foreign assets to the dest chain cannot be mixed as it is either a reserve or teleport
 * throws an error if foreign and native assets are found
 *
 * @param xcmDirection
 * @param destChainId
 * @param multiLocationAssetIds
 * @returns boolean
 */
export const checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain = (
	xcmDirection: Direction,
	destChainId: string,
	multiLocationAssetIds: string[],
) => {
	if (multiLocationAssetIds.length > 1) {
		let foreignMultiLocationAssetFound = false;
		let nativeMultiLocationAssetFound = false;

		// iterate through list and determine if each asset is native to the dest parachain
		for (const multilocation of multiLocationAssetIds) {
			const isNativeToDestChain = multiLocationAssetIsParachainsNativeAsset(destChainId, multilocation);

			if (isNativeToDestChain) {
				nativeMultiLocationAssetFound = true;
			} else {
				foreignMultiLocationAssetFound = true;
			}

			if (nativeMultiLocationAssetFound && foreignMultiLocationAssetFound) {
				throw new BaseError(
					`(${xcmDirection}) found both foreign and native multilocations in ${multiLocationAssetIds.toString()}. multilocation XCMs must only include either native or foreign assets of the destination chain.`,
					BaseErrorsEnum.InvalidInput,
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
const checkRelayToSystemAssetId = (assetId: string, relayChainInfo: ChainInfo<ChainInfoKeys>) => {
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
			`(RelayToSystem) asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`,
			BaseErrorsEnum.InvalidAsset,
		);
	}
};

/**
 * This will check the given assetId and ensure that it is the native token of the relay chain
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkRelayToParaAssetId = (assetId: string, relayChainInfo: ChainInfo<ChainInfoKeys>) => {
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
			`(RelayToPara) asset ${assetId} is not ${relayChain.specName}'s native asset. Expected ${relayChainNativeAsset}`,
			BaseErrorsEnum.InvalidAsset,
		);
	}
};
/**
 * This will check the given assetId and ensure that it is the native token of the relay chain
 *
 * @param assetId
 * @param relayChainInfo
 */
const checkSystemToRelayAssetId = (assetId: string, relayChainInfo: ChainInfo<ChainInfoKeys>) => {
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
			`(SystemToRelay) assetId ${assetId} not native to ${relayChain.specName}. Expected ${relayChainNativeAsset}`,
			BaseErrorsEnum.InvalidAsset,
		);
	}
};

export const checkLiquidTokenValidity = async (
	api: ApiPromise,
	registry: Registry,
	systemParachainInfo: ChainInfoKeys,
	assetId: string,
) => {
	const isValidInt = validateNumber(assetId);
	if (!isValidInt) {
		throw new BaseError(`Liquid Tokens must be valid Integers`, BaseErrorsEnum.InvalidAsset);
	}

	// check cache for pool asset
	if (registry.cacheLookupPoolAsset(assetId)) {
		return;
	}

	// check registry
	const poolPairIds = Object.keys(systemParachainInfo.poolPairsInfo);
	if (poolPairIds.includes(assetId)) {
		return;
	}

	// query chain state
	const poolAsset = await api.query.poolAssets.asset(assetId);
	if (poolAsset.isSome) {
		for (const poolPairsData of await api.query.assetConversion.pools.entries()) {
			const poolAssetData = JSON.stringify(poolPairsData[0]).replace(/(\d),/g, '$1');
			const poolAssetInfo = poolPairsData[1].unwrap();

			if (poolAssetInfo.lpToken.toString() === assetId) {
				const asset: {
					lpToken: string;
					pairInfo: string;
				} = {
					lpToken: assetId,
					pairInfo: poolAssetData,
				};

				// cache the queried liquidToken asset
				registry.setLiquidPoolTokenInCache(assetId, asset);
			}
		}
		return;
	}

	// liquid token not found in cache, registry or chain state
	throw new BaseError(
		`No liquid token asset was detected. When setting the option "transferLiquidToken" to true a valid liquid token assetId must be present.`,
		BaseErrorsEnum.InvalidAsset,
	);
};

const checkSystemAssets = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	systemParachainInfo: ChainInfoKeys,
	registry: Registry,
	xcmDirection: string,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer?: boolean,
) => {
	const currentChainId = registry.lookupChainIdBySpecName(specName);

	if (isForeignAssetsTransfer) {
		// check that the asset id is a valid multilocation
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(assetId, registry, xcmVersion);

		if (!multiLocationIsInRegistry) {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(api, registry, assetId);

			if (!isValidForeignAsset) {
				throw new BaseError(`MultiLocation ${assetId} not found`, BaseErrorsEnum.AssetNotFound);
			}
		}
	} else if (isLiquidTokenTransfer) {
		await checkLiquidTokenValidity(api, registry, systemParachainInfo, assetId);
	} else {
		const isValidInt = validateNumber(assetId);

		if (isValidInt) {
			let assetSymbol: string | undefined;

			// check the cache for the asset
			// if not in cache, check the registry
			if (registry.cacheLookupAsset(assetId)) {
				assetSymbol = registry.cacheLookupAsset(assetId);
			} else if (systemParachainInfo.assetsInfo[assetId]) {
				assetSymbol = systemParachainInfo.assetsInfo[assetId];
			}

			if (!assetSymbol) {
				// if asset is not in cache or registry, query the assets pallet to see if it has a value
				const asset = await api.query.assets.asset(assetId);

				// if asset is found in the assets pallet, return LocalTxType Assets
				if (asset.isNone) {
					throw new BaseError(
						`(${xcmDirection}) integer assetId ${assetId} not found in ${specName}`,
						BaseErrorsEnum.AssetNotFound,
					);
				} else {
					const assetSymbol = (await api.query.assets.metadata(assetId)).symbol.toHuman()?.toString();

					const assetStr = assetSymbol as string;
					// add the asset to the cache
					registry.setAssetInCache(assetId, assetStr);
				}
			}
		} else {
			// not a valid number
			// check if id is a valid token symbol of the system parachain chain
			if (assetId === '') {
				return;
			}

			// ensure character string is valid symbol for the system chain
			for (const token of systemParachainInfo.tokens) {
				if (token.toLowerCase() === assetId.toLowerCase()) {
					return;
				}
			}
			const cacheTokensMatched: AssetInfo[] = [];
			// not found in tokens, check the cache
			if (registry.cache[registry.relayChain][currentChainId]) {
				for (const [id, symbol] of Object.entries(registry.cache[registry.relayChain][currentChainId].assetsInfo)) {
					if (symbol.toLowerCase() === assetId.toLowerCase()) {
						// match found in cache
						const assetInfo: AssetInfo = {
							id,
							symbol,
						};
						cacheTokensMatched.push(assetInfo);
					}
				}
			}

			// 1 valid match found in cache
			if (cacheTokensMatched.length > 1) {
				const assetMessageInfo = cacheTokensMatched.map((token) => `assetId: ${token.id} symbol: ${token.symbol}`);
				const message =
					`Multiple assets found with symbol ${assetId}::\n${assetMessageInfo.toString()}\nPlease retry using an assetId rather than the token symbol`
						.trim()
						.replace(',', '\n');

				throw new BaseError(message, BaseErrorsEnum.MultipleNonUniqueAssetsFound);
			} else if (cacheTokensMatched.length === 1) {
				return;
			}

			const assetsInfoTokensMatched: AssetInfo[] = [];

			// if not found in system parachains tokens, or registry cache. Check assetsInfo
			for (const [id, symbol] of Object.entries(systemParachainInfo.assetsInfo)) {
				if (symbol.toLowerCase() === assetId.toLowerCase()) {
					const assetInfo: AssetInfo = {
						id,
						symbol,
					};
					assetsInfoTokensMatched.push(assetInfo);
				}
			}

			// check if multiple matches found
			// if more than 1 match is found throw an error and include details on the matched tokens
			if (assetsInfoTokensMatched.length > 1) {
				const assetMessageInfo = assetsInfoTokensMatched.map((token) => `assetId: ${token.id} symbol: ${token.symbol}`);
				const message =
					`Multiple assets found with symbol ${assetId}:\n${assetMessageInfo.toString()}\nPlease retry using an assetId rather than the token symbol
				`
						.trim()
						.replace(',', '\n');

				throw new BaseError(message, BaseErrorsEnum.MultipleNonUniqueAssetsFound);
			} else if (assetsInfoTokensMatched.length === 1) {
				return;
			}

			// if no native token for the system parachain was matched, throw an error
			throw new BaseError(
				`(${xcmDirection}) assetId ${assetId} not found for system parachain ${specName}`,
				BaseErrorsEnum.AssetNotFound,
			);
		}
	}
};

export const checkParaAssets = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	registry: Registry,
	xcmDirection: Direction,
) => {
	if (isParachainPrimaryNativeAsset(registry, specName, xcmDirection, assetId)) {
		return;
	}

	const currentRelayChainSpecName = registry.relayChain;
	const isValidInt = validateNumber(assetId);
	const paraId = registry.lookupChainIdBySpecName(specName);
	if (api.query.assets) {
		if (isValidInt) {
			if (!registry.cacheLookupAsset(assetId)) {
				// query the parachains assets pallet to see if it has a value matching the assetId
				const asset = await api.query.assets.asset(assetId);

				if (asset.isNone) {
					throw new BaseError(
						`(${xcmDirection}) integer assetId ${assetId} not found in ${specName}`,
						BaseErrorsEnum.AssetNotFound,
					);
				} else {
					const assetSymbol = (await api.query.assets.metadata(assetId)).symbol.toHuman()?.toString();
					const assetSymbolStr = assetSymbol as string;
					// store xcAsset in registry cache
					registry.setAssetInCache(assetId, assetSymbolStr);
				}
			}

			// Below checks when the asset exists on chain but not in our xcAssets registry.
			const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData;

			if (!paraXcAssets || paraXcAssets.length === 0) {
				throw new BaseError(
					`unable to initialize xcAssets registry for ${currentRelayChainSpecName}`,
					BaseErrorsEnum.InvalidPallet,
				);
			}

			for (const info of paraXcAssets) {
				if (typeof info.asset === 'string' && info.asset === assetId) {
					return;
				}
			}

			throw new BaseError(`unable to identify xcAsset with ID ${assetId}`, BaseErrorsEnum.AssetNotFound);
		} else {
			// not a valid number
			// check if id is a valid token symbol of the parachain chain
			const parachainAssets = await api.query.assets.asset.entries();

			for (let i = 0; i < parachainAssets.length; i++) {
				const parachainAsset = parachainAssets[i];
				const id = parachainAsset[0].args[0];

				const metadata = await api.query.assets.metadata(id);
				const symbol = metadata.symbol.toHuman()?.toString();
				if (symbol && symbol.toLowerCase() === assetId.toLowerCase()) {
					// store in registry cache
					registry.setAssetInCache(symbol, id.toString());
					return;
				}
			}

			// not an asset native to the Parachain
			// check xcAsset registry for the symbol
			const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData;

			if (!paraXcAssets || paraXcAssets.length === 0) {
				throw new BaseError(
					`unable to initialize xcAssets registry for ${currentRelayChainSpecName}`,
					BaseErrorsEnum.InvalidPallet,
				);
			}

			for (const info of paraXcAssets) {
				if (typeof info.symbol === 'string' && info.symbol.toLowerCase() === assetId.toLowerCase()) {
					return;
				}
			}

			// if no native token for the parachain was matched, throw an error
			throw new BaseError(
				`(${xcmDirection}) symbol assetId ${assetId} not found for parachain ${specName}`,
				BaseErrorsEnum.AssetNotFound,
			);
		}
	} else {
		// Parachain doesn't support pallet assets
		// check for assetId in registry
		const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData;

		if (!paraXcAssets || paraXcAssets.length === 0) {
			throw new BaseError(
				`unable to initialize xcAssets registry for ${currentRelayChainSpecName}`,
				BaseErrorsEnum.InvalidPallet,
			);
		}
		// if integer asset Id check if valid registry asset
		if (isValidInt) {
			for (const info of paraXcAssets) {
				if (typeof info.asset === 'string' && info.asset.toLowerCase() === assetId.toLowerCase()) {
					return;
				}
			}
		} else {
			// check for assetId symbol match
			for (const info of paraXcAssets) {
				if (typeof info.symbol === 'string' && info.symbol.toLowerCase() === assetId.toLowerCase()) {
					return;
				}
			}
		}

		// if no native token for the parachain was matched, throw an error
		throw new BaseError(
			`(${xcmDirection}) symbol assetId ${assetId} not found for parachain ${specName}`,
			BaseErrorsEnum.AssetNotFound,
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
const checkSystemToParaAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo<ChainInfoKeys>,
	registry: Registry,
	xcmDirection: Direction,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
) => {
	await checkIsValidSystemChainAssetId(
		api,
		assetId,
		specName,
		relayChainInfo,
		registry,
		xcmDirection,
		xcmVersion,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
	);
};

export const checkIsValidSystemChainAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	relayChainInfo: ChainInfo<ChainInfoKeys>,
	registry: Registry,
	xcmDirection: Direction,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
) => {
	const systemChainId = registry.lookupChainIdBySpecName(specName);
	const systemParachainInfo = relayChainInfo[systemChainId];

	if (typeof assetId === 'string') {
		await checkSystemAssets(
			api,
			assetId,
			specName,
			systemParachainInfo,
			registry,
			xcmDirection,
			xcmVersion,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
		);
	}
};

/**
 *
 * @param assetId
 * @param specName
 * @param registry
 */
const checkParaOriginAssetId = async (api: ApiPromise, assetId: string, specName: string, registry: Registry) => {
	if (typeof assetId === 'string') {
		// An assetId may be a hex value to represent a GeneralKey for erc20 tokens.
		// These will be represented as Foreign Assets in regard to its MultiLocation
		if (isHex(assetId)) {
			const ethAddr = isEthereumAddress(assetId);
			if (!ethAddr) {
				throw new BaseError(
					`(ParaToSystem) assetId ${assetId}, is not a valid erc20 token.`,
					BaseErrorsEnum.InvalidAsset,
				);
			}

			return;
		}

		await checkParaAssets(api, assetId, specName, registry, Direction.ParaToSystem);
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
	relayChainInfo: ChainInfo<ChainInfoKeys>,
	registry: Registry,
	xcmDirection: Direction,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
) => {
	await checkIsValidSystemChainAssetId(
		api,
		assetId,
		specName,
		relayChainInfo,
		registry,
		xcmDirection,
		xcmVersion,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
	);
};

/**
 * Check the assets for ParaToRelay.
 *
 * @param assetId
 * @param registry
 * @param specName
 */
const checkParaToRelayAssetId = (assetId: string, registry: Registry, specName: string) => {
	const relayRegistry = registry.currentRelayRegistry;
	const relayNativeToken = relayRegistry[0].tokens[0];
	const nativeEqAssetId = relayNativeToken === assetId;
	const curParaId = registry.lookupChainIdBySpecName(specName);
	const curParaRegistry = relayRegistry[curParaId];
	const { xcAssetsData } = curParaRegistry;

	let assetIsRelayChainNativeAsset = false;
	if (assetId === '') {
		assetIsRelayChainNativeAsset = true;
	}

	// If the asset equals the relays native asset exit.
	if (nativeEqAssetId) {
		assetIsRelayChainNativeAsset = true;
	}

	const isValidInt = validateNumber(assetId);
	if (isValidInt && xcAssetsData && xcAssetsData.length > 0) {
		// We assume the first xcAsset will represent the relay chain
		// since they are all sorted in the registry.
		if (xcAssetsData[0].asset === assetId) {
			assetIsRelayChainNativeAsset = true;
		}
	}

	const paraIncludesRelayNativeInTokens = curParaRegistry.tokens.includes(relayNativeToken);
	const paraIncludesRelayNativeInXcAssets = xcAssetsData && xcAssetsData[0].symbol === relayNativeToken;

	if (paraIncludesRelayNativeInTokens || paraIncludesRelayNativeInXcAssets) {
		assetIsRelayChainNativeAsset = true;
	}

	if (!assetIsRelayChainNativeAsset) {
		throw new BaseError(
			"The current input for assetId's does not meet our specifications for ParaToRelay transfers.",
			BaseErrorsEnum.InvalidAsset,
		);
	}
};

/**
 * Checks to ensure that assetId's have a length no greater than MAX_ASSETS_FOR_TRANSFER, throws an error if greater than MAX_ASSETS_FOR_TRANSFER
 *
 * @param assetIds
 */
export const checkAssetIdsLengthIsValid = (assetIds: string[]) => {
	if (assetIds.length > MAX_ASSETS_FOR_TRANSFER) {
		throw new BaseError(
			`Maximum number of assets allowed for transfer is 2. Found ${assetIds.length} assetIds`,
			BaseErrorsEnum.InvalidInput,
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
				if (asset1.trim().toLowerCase().replace(/ /g, '') === asset2.trim().toLowerCase().replace(/ /g, '')) {
					duplicateAssetIds.push(asset2);
				}
			}
		}

		if (duplicateAssetIds.length > 0) {
			if (assetIds[0] === '') {
				throw new BaseError(
					`AssetIds must be unique. Found duplicate native relay assets as empty strings`,
					BaseErrorsEnum.InvalidInput,
				);
			}

			throw new BaseError(
				`AssetIds must be unique. Found duplicate assetId ${duplicateAssetIds[0]}`,
				BaseErrorsEnum.InvalidInput,
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

			const isValidInt = validateNumber(assetId);
			if (isValidInt) {
				integerAssetIdFound = assetId;
			} else if (assetId.toLowerCase().includes('parents')) {
				multiLocationAssetIdFound = assetId;
			} else {
				symbolAssetIdFound = assetId;
			}
		}

		if (relayDefaultValueFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both default relay native asset and foreign asset with assetId: ${multiLocationAssetIdFound}. Relay native asset and foreign assets can't be transferred within the same call.`,
				BaseErrorsEnum.InvalidInput,
			);
		}

		if (integerAssetIdFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both native asset with assetID ${integerAssetIdFound} and foreign asset with assetId ${multiLocationAssetIdFound}. Native assets and foreign assets can't be transferred within the same call.`,
				BaseErrorsEnum.InvalidInput,
			);
		}

		if (symbolAssetIdFound && multiLocationAssetIdFound) {
			throw new BaseError(
				`Found both symbol ${symbolAssetIdFound} and multilocation assetId ${multiLocationAssetIdFound}. Asset Ids must be symbol and integer or multilocation exclusively.`,
				BaseErrorsEnum.InvalidInput,
			);
		}
	}
};

/**
 * Checks to ensure that the xcmVersion is at least 3 for a SystemToBridge transaction
 *
 * @param xcmDirection
 * @param xcmVersion
 */
export const checkXcmVersionIsValidForSystemToBridge = (xcmVersion: number) => {
	if (xcmVersion && xcmVersion < 3) {
		throw new BaseError(
			'SystemToBridge transactions require XCM version 3 or greater',
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}
};

/**
 * Checks to ensure that required inputs are provided for SystemToBridge transactions
 *
 * @param paysWithFeeDest
 * @param assetTransferType
 * @param remoteReserveAssetTransferTypeLocation
 * @param feesTransferType
 * @param remoteReserveFeesTransferTypeLocation
 */
export const checkSystemToBridgeInputs = (
	paysWithFeeDest: string | undefined,
	assetTransferType: string | undefined,
	remoteReserveAssetTransferTypeLocation: string | undefined,
	feesTransferType: string | undefined,
	remoteReserveFeesTransferTypeLocation: string | undefined,
) => {
	if (assetTransferType && !paysWithFeeDest) {
		throw new BaseError(
			'paysWithFeeDest input is required for bridge transactions when assetTransferType is provided',
			BaseErrorsEnum.InvalidInput,
		);
	}
	if (assetTransferType && assetTransferType === 'RemoteReserve' && !remoteReserveAssetTransferTypeLocation) {
		throw new BaseError(
			'remoteReserveAssetTransferTypeLocation input is required for bridge transactions when asset transfer type is RemoteReserve',
			BaseErrorsEnum.InvalidInput,
		);
	}
	if (feesTransferType && feesTransferType === 'RemoteReserve' && !remoteReserveFeesTransferTypeLocation) {
		throw new BaseError(
			'remoteReserveFeeAssetTransferTypeLocation input is required for bridge transactions when fee asset transfer type is RemoteReserve',
			BaseErrorsEnum.InvalidInput,
		);
	}
};

export const checkPaysWithFeeDestAssetIdIsInAssets = (assetIds: string[], paysWithFeeDest: string | undefined) => {
	if (!paysWithFeeDest) {
		return;
	}

	if (!assetIds.includes(paysWithFeeDest)) {
		throw new BaseError(
			`paysWithFeeDest asset must be present in assets to be transferred. Did not find ${paysWithFeeDest} in ${assetIds.toString()}`,
		);
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
	paysWithFeeDest?: string,
) => {
	if (
		xcmDirection != Direction.ParaToSystem &&
		xcmDirection != Direction.ParaToPara &&
		paysWithFeeDest &&
		xcmVersion &&
		xcmVersion < 3
	) {
		throw new BaseError('paysWithFeeDest requires XCM version 3 or greater', BaseErrorsEnum.InvalidXcmVersion);
	}
};

/**
 * Ensures that the direction given for a liquid token transfer is correct.
 *
 * @param xcmDirection
 * @param isLiquidTokenTransfer
 */
export const checkLiquidTokenTransferDirectionValidity = (xcmDirection: Direction, isLiquidTokenTransfer: boolean) => {
	if (xcmDirection !== Direction.SystemToPara && isLiquidTokenTransfer) {
		throw new BaseError(
			`isLiquidTokenTransfer may not be true for the xcmDirection: ${xcmDirection}.`,
			BaseErrorsEnum.InvalidInput,
		);
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
	relayChainInfo: ChainInfo<ChainInfoKeys>,
	specName: string,
	xcmDirection: Direction,
	registry: Registry,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
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
				xcmVersion,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
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
				xcmVersion,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			);
		}

		if (xcmDirection === Direction.ParaToSystem || xcmDirection === Direction.ParaToPara) {
			await checkParaOriginAssetId(api, assetId, specName, registry);
		}

		if (xcmDirection === Direction.ParaToRelay) {
			checkParaToRelayAssetId(assetId, registry, specName);
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
export const checkXcmTxInputs = async (baseArgs: XcmBaseArgsWithPallet, opts: CheckXcmTxInputsOpts) => {
	const { api, direction, assetIds, amounts, destChainId, xcmVersion, specName, registry, xcmPallet } = baseArgs;
	const {
		paysWithFeeDest,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		isPrimaryParachainNativeAsset,
		assetTransferType,
		remoteReserveAssetTransferTypeLocation,
		feesTransferType,
		remoteReserveFeesTransferTypeLocation,
	} = opts;
	const relayChainInfo = registry.currentRelayRegistry;

	if (isPrimaryParachainNativeAsset) {
		/**
		 * Checks that the assetIds length is correct for primary native parachain asset tx
		 */
		checkParaPrimaryAssetAssetIdsLength(assetIds);
		/**
		 * Checks that the amounts length is correct for primary native parachain asset tx
		 */
		checkParaPrimaryAssetAmountsLength(amounts);
	}

	/**
	 * Checks that the XcmVersion works with `PaysWithFeeDest` option
	 */
	checkXcmVersionIsValidForPaysWithFeeDest(direction, xcmVersion, paysWithFeeDest);

	/**
	 * Checks that the direction of the `transferLiquidToken` option is correct.
	 */
	checkLiquidTokenTransferDirectionValidity(direction, isLiquidTokenTransfer);

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
		direction,
		registry,
		xcmVersion,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
	);

	if (direction === Direction.RelayToSystem) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (direction === Direction.RelayToPara) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (direction === Direction.SystemToRelay) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}

	if (direction === Direction.SystemToPara) {
		if (isForeignAssetsTransfer) {
			checkMultiLocationIdLength(assetIds);
			checkMultiLocationAmountsLength(amounts);
			checkAssetsAmountMatch(assetIds, amounts);
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(direction, destChainId, assetIds);
		}
		checkAssetsAmountMatch(assetIds, amounts);
	}

	if (direction === Direction.SystemToSystem) {
		if (isForeignAssetsTransfer) {
			checkAssetsAmountMatch(assetIds, amounts);
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(direction, destChainId, assetIds);
		}
		checkIfNativeRelayChainAssetPresentInMultiAssetIdList(assetIds, registry);
	}

	if (direction === Direction.SystemToBridge) {
		checkMultiLocationIdLength(assetIds);
		checkMultiLocationAmountsLength(amounts);
		checkAssetsAmountMatch(assetIds, amounts);
		getGlobalConsensusSystemName(destChainId);
		checkSystemToBridgeInputs(
			paysWithFeeDest,
			assetTransferType,
			remoteReserveAssetTransferTypeLocation,
			feesTransferType,
			remoteReserveFeesTransferTypeLocation,
		);
		checkPaysWithFeeDestAssetIdIsInAssets(assetIds, paysWithFeeDest);
		checkXcmVersionIsValidForSystemToBridge(xcmVersion);
	}

	if (direction === Direction.ParaToSystem || direction === Direction.ParaToPara) {
		CheckXTokensPalletOriginIsNonForeignAssetTx(direction, xcmPallet, isForeignAssetsTransfer);
		checkAssetsAmountMatch(assetIds, amounts, isPrimaryParachainNativeAsset);
	}

	if (direction === Direction.ParaToRelay) {
		checkRelayAssetIdLength(assetIds);
		checkRelayAmountsLength(amounts);
	}
};

export const checkClaimAssetsInputs = (assets: string[], amounts: string[]) => {
	checkAssetsAmountMatch(assets, amounts);
	checkAssetIdsAreOfSameAssetIdType(assets);
};
