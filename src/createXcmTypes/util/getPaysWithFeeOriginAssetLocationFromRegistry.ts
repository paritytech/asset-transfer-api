// Copyright 2024 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../../AssetTransferApi.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { AssetsInfo } from '../../registry/types.js';
import { validateNumber } from '../../validate/index.js';
import { UnionXcmMultiLocation } from '../types.js';

export const getPaysWithFeeOriginAssetLocationFromRegistry = (
	ataAPI: AssetTransferApi,
	paysWithFeeOriginAssetId: string,
): UnionXcmMultiLocation | undefined => {
	if (paysWithFeeOriginAssetId.length === 0) {
		return undefined;
	}

	let location: UnionXcmMultiLocation | undefined = undefined;

	const { registry, specName } = ataAPI;
	const currentChainId = registry.lookupChainIdBySpecName(specName);
	const currentRelayRegistry = registry.currentRelayRegistry;
	const assetIsValidInt = validateNumber(paysWithFeeOriginAssetId);
	const { assetsInfo, foreignAssetsInfo } = currentRelayRegistry[currentChainId];

	if (assetIsValidInt) {
		// if assetId index is valid, return the location using the Assets Pallet Instance ID
		if (assetsInfo[paysWithFeeOriginAssetId] && assetsInfo[paysWithFeeOriginAssetId].length > 0) {
			location = {
				parents: 0,
				interior: {
					X2: [
						{
							PalletInstance: '50',
						},
						{
							GeneralIndex: paysWithFeeOriginAssetId,
						},
					],
				},
			} as UnionXcmMultiLocation;
		}
	} else {
		const assetsInfoTokensMatched: AssetsInfo[] = [];
		for (const [id, symbol] of Object.entries(assetsInfo)) {
			if (symbol.toLowerCase() === paysWithFeeOriginAssetId.toLowerCase()) {
				const assetInfo: AssetsInfo = {
					id,
					symbol,
				};
				assetsInfoTokensMatched.push(assetInfo);
			}
		}

		if (assetsInfoTokensMatched.length > 1) {
			const assetMessageInfo = assetsInfoTokensMatched.map((token) => `assetId: ${token.id} symbol: ${token.symbol}`);
			const message =
				`Multiple assets found with symbol ${paysWithFeeOriginAssetId}:\n${assetMessageInfo.toString()}\nPlease provide an integer assetId or valid asset location for paysWithFeeOrigin rather than the token symbol`
					.trim()
					.replace(/,/g, '\n');

			throw new BaseError(message, BaseErrorsEnum.MultipleNonUniqueAssetsFound);
		}

		const registryAssetId = Object.keys(assetsInfo).find(
			(key) => assetsInfo[key].toLowerCase() === paysWithFeeOriginAssetId.toLowerCase(),
		);

		if (registryAssetId) {
			// if asset is in registry, return the asset location based on the Assets Pallet Instance ID
			location = {
				parents: 0,
				interior: {
					X2: [
						{
							PalletInstance: 50,
						},
						{
							GeneralIndex: registryAssetId,
						},
					],
				},
			} as UnionXcmMultiLocation;
		}
	}

	// Check Foreign Assets
	if (!location) {
		const assetsInfoTokensMatched: AssetsInfo[] = [];
		for (const [key, data] of Object.entries(foreignAssetsInfo)) {
			if (key.toLowerCase() === paysWithFeeOriginAssetId.toLowerCase()) {
				const assetInfo: AssetsInfo = {
					id: data.multiLocation,
					symbol: data.symbol,
				};
				assetsInfoTokensMatched.push(assetInfo);
			}
		}

		if (assetsInfoTokensMatched.length > 1) {
			const assetMessageInfo = assetsInfoTokensMatched.map((token) => `assetId: ${token.id} symbol: ${token.symbol}`);
			const message =
				`Multiple assets found with symbol ${paysWithFeeOriginAssetId}:\n${assetMessageInfo.toString()}\nPlease provide a valid asset location for paysWithFeeOrigin rather than the token symbol`
					.trim()
					.replace(/,/g, '\n');

			throw new BaseError(message, BaseErrorsEnum.MultipleNonUniqueAssetsFound);
		}

		for (const [key, data] of Object.entries(foreignAssetsInfo)) {
			if (key.toLowerCase() === paysWithFeeOriginAssetId.toLowerCase()) {
				location = JSON.parse(data.multiLocation) as UnionXcmMultiLocation;
			}
		}
	}

	return location;
};
