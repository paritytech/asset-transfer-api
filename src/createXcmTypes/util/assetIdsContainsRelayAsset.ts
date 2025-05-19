// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry/index.js';
import { isRelayNativeAsset } from './isRelayNativeAsset.js';

export const assetIdsContainRelayAsset = (assetIds: string[], registry: Registry): boolean => {
	// if assetIds is empty it is the relay asset
	if (assetIds.length === 0) {
		return true;
	}

	const relayAssetMultiLocation = `{"parents": 1, "interior": { "Here": ''}}`;

	for (const asset of assetIds) {
		// check relay tokens and if matched it is the relay asset
		if (isRelayNativeAsset(registry, asset)) {
			return true;
		}

		// check assets against relay asset multilocation
		if (
			asset.toLowerCase().trim().replace(/ /g, '') === relayAssetMultiLocation.toLowerCase().trim().replace(/ /g, '')
		) {
			return true;
		}
	}

	return false;
};
