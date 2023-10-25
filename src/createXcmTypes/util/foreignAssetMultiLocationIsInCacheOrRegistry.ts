// Copyright 2023 Parity Technologies (UK) Ltd.

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { Registry } from '../../registry';
import type { ForeignAssetsInfo } from '../../registry/types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import { sanitizeKeys } from '../../util/sanitizeKeys';

export const foreignAssetMultiLocationIsInCacheOrRegistry = (
	multilocationStr: string,
	registry: Registry,
	xcmVersion: number
): boolean => {
	// check if foreign asset exists in assets cache
	const foreignAssetsCache = registry.cache[registry.relayChain][ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	if (checkForeignAssetExists(foreignAssetsCache, multilocationStr, xcmVersion)) {
		return true;
	}

	// check if foreign asset exists in registry
	const foreignAssetsRegistry = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	return checkForeignAssetExists(foreignAssetsRegistry, multilocationStr, xcmVersion);
};

const checkForeignAssetExists = (
	foreignAssetsInfo: ForeignAssetsInfo,
	multiLocationStr: string,
	xcmVersion: number
): boolean => {
	const multiLocation = resolveMultiLocation(multiLocationStr, xcmVersion);

	if (Object.keys(foreignAssetsInfo).length > 0) {
		const foreignAssets = Object.entries(foreignAssetsInfo).map((data) => {
			return data[1].multiLocation;
		});

		for (const asset of foreignAssets) {
			// TODO: How to ensure 2 foreign assets are exactly the same. Best
			// to sanitize both then compare. Also what if some value is of a `parents: number` and another
			// is of `parents: string`...

			if (JSON.stringify(sanitizeKeys(JSON.parse(asset))) === JSON.stringify(multiLocation)) {
				return true;
			}
		}
	}

	return false;
};
