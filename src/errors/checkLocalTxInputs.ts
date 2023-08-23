// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { foreignAssetMultiLocationIsInRegistry } from '../createXcmTypes/util/foreignAssetMultiLocationIsInRegistry';
import { foreignAssetsMultiLocationExists } from '../createXcmTypes/util/foreignAssetsMultiLocationExists';
import { getAssetId } from '../createXcmTypes/util/getAssetId';
import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import { checkLiquidTokenValidity } from '../errors/checkXcmTxInputs';
import { Registry } from '../registry';
import { BaseError, BaseErrorsEnum } from './BaseError';

enum LocalTxType {
	Assets = 'Assets',
	Balances = 'Balances',
	ForeignAssets = 'ForeignAssets',
	PoolAssets = 'PoolAssets',
}

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
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean
): Promise<LocalTxType> => {
	// Ensure the lengths in assetIds and amounts is correct
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
			BaseErrorsEnum.InvalidInput
		);
	}

	if (isForeignAssetsTransfer) {
		if (assetIds.length === 0) {
			throw new BaseError(
				'Local foreignAsset transactions must have the `assetIds` input be a length of 1',
				BaseErrorsEnum.InvalidInput
			);
		}

		// check the cache and registrys foreignAssetsInfo to see if the provided foreign asset exists
		const multiLocationStr = assetIds[0];
		const foreignAssetIsInRegistry = foreignAssetMultiLocationIsInRegistry(
			api,
			multiLocationStr,
			registry
		);

		if (foreignAssetIsInRegistry) {
			return LocalTxType.ForeignAssets;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(
				api,
				registry,
				multiLocationStr
			);
			if (isValidForeignAsset) {
				return LocalTxType.ForeignAssets;
			} else {
				throw new BaseError(
					`MultiLocation ${multiLocationStr} not found`,
					BaseErrorsEnum.AssetNotFound
				);
			}
		}
	} else if (isLiquidTokenTransfer) {
		const relayChainInfo = registry.currentRelayRegistry;
		const systemChainId = getChainIdBySpecName(registry, specName);
		const systemParachainInfo = relayChainInfo[systemChainId];

		// If anything is incorrect this will throw an error.
		await checkLiquidTokenValidity(
			api,
			registry,
			specName,
			systemParachainInfo,
			assetIds[0]
		);

		return LocalTxType.PoolAssets;
	} else {
		const relayChainInfo = registry.currentRelayRegistry;
		const systemChainId = getChainIdBySpecName(registry, specName);
		const systemParachainInfo = relayChainInfo[systemChainId];

		/**
		 * We assume when the assetId's input is empty that the native token is to be transferred.
		 */
		if (assetIds.length === 0) {
			return LocalTxType.Balances;
		}

		let assetId = assetIds[0];

		const isNativeToken = systemParachainInfo.tokens.find(
			(token) => token.toLowerCase() === assetId.toLowerCase()
		);
		if (isNativeToken !== undefined) {
			return LocalTxType.Balances;
		}

		// const assetIsNumber = !Number.isNaN(assetId);

		// not a number so we check the registry using the symbol
		assetId = await getAssetId(
			api,
			registry,
			assetId,
			specName,
			isForeignAssetsTransfer
		);

		if (assetId.length > 0) {
			return LocalTxType.Assets;
		} else {
			throw new BaseError(`The integer assetId ${assetId} was not found.`);
		}
	}
};
