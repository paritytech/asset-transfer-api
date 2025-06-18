// Copyright 2023 Parity Technologies (UK) Ltd.

import type { FungibleAssetType } from '../types.js';

/**
 * This removes duplicate assets when given a sorted list
 *
 * @param assets FungibleAssetType[]
 */
export const dedupeAssets = (assets: FungibleAssetType[]): FungibleAssetType[] => {
	const dedupedAssets = [];

	for (let i = 0; i < assets.length; i++) {
		const multiAsset = assets[i];

		if (i === 0) {
			dedupedAssets.push(multiAsset);
			continue;
		}

		const previousAsset = dedupedAssets[dedupedAssets.length - 1];
		if (JSON.stringify(multiAsset) === JSON.stringify(previousAsset)) {
			continue;
		}

		dedupedAssets.push(multiAsset);
	}

	return dedupedAssets as FungibleAssetType[];
};
