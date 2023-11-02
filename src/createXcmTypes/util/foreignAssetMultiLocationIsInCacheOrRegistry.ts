// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import type { ForeignAssetsInfo } from '../../registry/types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';

export const foreignAssetMultiLocationIsInCacheOrRegistry = (
	api: ApiPromise,
	multilocationStr: string,
	registry: Registry,
	xcmVersion: number
): boolean => {
	// check if foreign asset exists in assets cache
	const foreignAssetsCache = registry.cache[registry.relayChain][ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	if (checkForeignAssetExists(api, foreignAssetsCache, multilocationStr, xcmVersion)) {
		return true;
	}

	// check if foreign asset exists in registry
	const foreignAssetsRegistry = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	return checkForeignAssetExists(api, foreignAssetsRegistry, multilocationStr, xcmVersion);
};

const checkForeignAssetExists = (
	api: ApiPromise,
	foreignAssetsInfo: ForeignAssetsInfo,
	multiLocationStr: string,
	xcmVersion: number
): boolean => {
	try {
		const multiLocation = resolveMultiLocation(api, multiLocationStr, xcmVersion);

		if (Object.keys(foreignAssetsInfo).length > 0) {
			const foreignAssets = Object.entries(foreignAssetsInfo).map((data) => {
				return data[1].multiLocation;
			});

			for (const asset of foreignAssets) {
				const foreignAssetMultiLocation = resolveMultiLocation(api, asset, xcmVersion);

				if (foreignAssetMultiLocation.toString() === multiLocation.toString()) {
					return true;
				}
			}
		}
	} catch (error) {
		if ((error as Error).message.includes('::')) {
			const errorInfo = (error as Error).message.split('::');
			const errorDetails = errorInfo[errorInfo.length - 2].concat(errorInfo[errorInfo.length - 1]);
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
