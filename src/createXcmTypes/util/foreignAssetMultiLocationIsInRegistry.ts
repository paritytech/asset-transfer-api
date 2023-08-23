// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import { ForeignAssetsInfo } from '../../registry/types';

export const foreignAssetMultiLocationIsInRegistry = (
	api: ApiPromise,
	multilocationStr: string,
	registry: Registry
): boolean => {
	if (!registry.assetsCache[registry.relayChain][ASSET_HUB_CHAIN_ID]) {
		registry.assetsCache[registry.relayChain][ASSET_HUB_CHAIN_ID] = {
			assetsInfo: {},
			poolPairsInfo: {},
			foreignAssetsPalletInstance: null,
			assetsPalletInstance: null,
			specName: '',
			tokens: [],
			foreignAssetsInfo: {},
		};
	}

	// check if foreign asset exists in assets cache
	const foreignAssetsCache =
		registry.assetsCache[registry.relayChain][ASSET_HUB_CHAIN_ID]
			.foreignAssetsInfo;
	if (checkForeignAssetExists(api, foreignAssetsCache, multilocationStr)) {
		return true;
	}

	// check if foreign asset exists in registry
	const foreignAssetsRegistry =
		registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	return checkForeignAssetExists(api, foreignAssetsRegistry, multilocationStr);

	// try {
	// 	const assetHubChainId = 1000;

	// 	const multiLocation = api.registry.createType(
	// 		'MultiLocation',
	// 		JSON.parse(multilocationStr)
	// 	);

	// 	const { foreignAssetsInfo: maybeForeignAssetsInfo } =
	// 		registry.currentRelayRegistry[assetHubChainId];

	// 	if (Object.keys(maybeForeignAssetsInfo).length > 0) {
	// 		const foreignAssetInfo = maybeForeignAssetsInfo as ForeignAssetsInfo;

	// 		const foreignAssets = Object.entries(foreignAssetInfo).map((data) => {
	// 			return data[1].multiLocation;
	// 		});

	// 		for (const asset of foreignAssets) {
	// 			const foreignAssetMultiLocation = api.registry.createType(
	// 				'MultiLocation',
	// 				JSON.parse(asset)
	// 			);

	// 			if (foreignAssetMultiLocation.toString() === multiLocation.toString()) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// } catch (error) {
	// 	if ((error as Error).message.includes('::')) {
	// 		const errorInfo = (error as Error).message.split('::');
	// 		const errorDetails = errorInfo[errorInfo.length - 2].concat(
	// 			errorInfo[errorInfo.length - 1]
	// 		);
	// 		throw new BaseError(
	// 			`Error creating MultiLocation type:${errorDetails}`,
	// 			BaseErrorsEnum.InvalidMultiLocationAsset
	// 		);
	// 	} else {
	// 		throw new BaseError(
	// 			`Error creating multilocation type: ${(error as Error).message}`,
	// 			BaseErrorsEnum.InvalidMultiLocationAsset
	// 		);
	// 	}
	// }

	// return false;
};

const checkForeignAssetExists = (
	api: ApiPromise,
	foreignAssetsInfo: ForeignAssetsInfo,
	multiLocationStr: string
): boolean => {
	try {
		const multiLocation = api.registry.createType(
			'MultiLocation',
			JSON.parse(multiLocationStr)
		);

		if (Object.keys(foreignAssetsInfo).length > 0) {
			const foreignAssets = Object.entries(foreignAssetsInfo).map((data) => {
				return data[1].multiLocation;
			});

			for (const asset of foreignAssets) {
				const foreignAssetMultiLocation = api.registry.createType(
					'MultiLocation',
					JSON.parse(asset)
				);

				if (foreignAssetMultiLocation.toString() === multiLocation.toString()) {
					return true;
				}
			}
		}
	} catch (error) {
		if ((error as Error).message.includes('::')) {
			const errorInfo = (error as Error).message.split('::');
			const errorDetails = errorInfo[errorInfo.length - 2].concat(
				errorInfo[errorInfo.length - 1]
			);
			throw new BaseError(
				`Error creating MultiLocation type:${errorDetails}`,
				BaseErrorsEnum.InvalidMultiLocationAsset
			);
		} else {
			throw new BaseError(
				`Error creating multilocation type: ${(error as Error).message}`,
				BaseErrorsEnum.InvalidMultiLocationAsset
			);
		}
	}

	return false;
};
