// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { foreignAssetMultiLocationIsInCacheOrRegistry } from '../../createXcmTypes/util/foreignAssetMultiLocationIsInCacheOrRegistry';
import { foreignAssetsMultiLocationExists } from '../../createXcmTypes/util/foreignAssetsMultiLocationExists';
import { getAssetId } from '../../createXcmTypes/util/getAssetId';
import { Registry } from '../../registry';
import { BaseError, BaseErrorsEnum } from '../BaseError';
import { checkLiquidTokenValidity } from '../checkXcmTxInputs';
import { LocalTxType } from './types';

/**
 * Check a local transactions inputs to ensure they are correct.
 * If there is an issue it will throw a descriptive message.
 *
 * @param assetIds
 * @param amounts
 */
export const checkLocalTxInput = async (
	api: ApiPromise,
	assetIds: string[],
	amounts: string[],
	specName: string,
	registry: Registry,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
): Promise<LocalTxType> => {
	// Ensure the lengths in assetIds and amounts is correct
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
			BaseErrorsEnum.InvalidInput,
		);
	}

	if (isForeignAssetsTransfer) {
		if (assetIds.length === 0) {
			throw new BaseError(
				'Local foreignAsset transactions must have the `assetIds` input be a length of 1',
				BaseErrorsEnum.InvalidInput,
			);
		}

		// check the cache and registrys foreignAssetsInfo to see if the provided foreign asset exists
		const multiLocationStr = assetIds[0];
		const foreignAssetIsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(
			multiLocationStr,
			registry,
			xcmVersion,
		);

		if (foreignAssetIsInRegistry) {
			return LocalTxType.ForeignAssets;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(api, registry, multiLocationStr, xcmVersion);
			if (isValidForeignAsset) {
				return LocalTxType.ForeignAssets;
			} else {
				throw new BaseError(`MultiLocation ${multiLocationStr} not found`, BaseErrorsEnum.AssetNotFound);
			}
		}
	} else if (isLiquidTokenTransfer) {
		const relayChainInfo = registry.currentRelayRegistry;
		const systemChainId = registry.lookupChainIdBySpecName(specName);
		const systemParachainInfo = relayChainInfo[systemChainId];

		// If anything is incorrect this will throw an error.
		await checkLiquidTokenValidity(api, registry, systemParachainInfo, assetIds[0]);

		return LocalTxType.PoolAssets;
	} else {
		const relayChainInfo = registry.currentRelayRegistry;
		const systemChainId = registry.lookupChainIdBySpecName(specName);
		const systemParachainInfo = relayChainInfo[systemChainId];

		/**
		 * We assume when the assetId's input is empty that the native token is to be transferred.
		 */
		if (assetIds.length === 0) {
			return LocalTxType.Balances;
		}

		let assetId = assetIds[0];

		// in the case the asset is an empty string, we consider it the relay asset
		if (assetId === '') {
			return LocalTxType.Balances;
		}

		const isNativeToken = systemParachainInfo.tokens.find((token) => token.toLowerCase() === assetId.toLowerCase());
		if (isNativeToken !== undefined) {
			return LocalTxType.Balances;
		}

		// not a number so we check the registry using the symbol
		assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, isForeignAssetsTransfer);

		if (assetId.length > 0) {
			return LocalTxType.Assets;
		} else {
			throw new BaseError(`The integer assetId ${assetId} was not found.`);
		}
	}
};
