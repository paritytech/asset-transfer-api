import { ASSET_HUB_CHAIN_ID } from '../../consts.js';
import { Registry } from '../../registry/index.js';
import type { ForeignAssetsInfo } from '../../registry/types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import { XcmCreator } from '../types.js';

export const foreignAssetMultiLocationIsInCacheOrRegistry = (
	multilocationStr: string,
	registry: Registry,
	xcmCreator: XcmCreator,
): boolean => {
	// check if foreign asset exists in assets cache
	const foreignAssetsCache = registry.cache[registry.relayChain][ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	if (checkForeignAssetExists(foreignAssetsCache, multilocationStr, xcmCreator)) {
		return true;
	}

	// check if foreign asset exists in registry
	const foreignAssetsRegistry = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID].foreignAssetsInfo;
	return checkForeignAssetExists(foreignAssetsRegistry, multilocationStr, xcmCreator);
};

const checkForeignAssetExists = (
	foreignAssetsInfo: ForeignAssetsInfo,
	multiLocationStr: string,
	xcmCreator: XcmCreator,
): boolean => {
	const multiLocation = resolveMultiLocation(multiLocationStr, xcmCreator);

	if (Object.keys(foreignAssetsInfo).length > 0) {
		const foreignAssets = Object.entries(foreignAssetsInfo).map((data) => {
			return data[1].multiLocation;
		});

		for (const asset of foreignAssets) {
			// We sanitize `assets` here since multiLocation is already sanitized.
			if (JSON.stringify(sanitizeKeys(JSON.parse(asset))) === JSON.stringify(multiLocation)) {
				return true;
			}
		}
	}

	return false;
};
