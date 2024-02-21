// Copyright 2023 Parity Technologies (UK) Ltd.

import type { FungibleObjAssetType, FungibleStrAssetType } from '../types';

/**
 * This removes duplicate assets when given a sorted list
 *
 * @param assets FungibleStrAssetType[] | FungibleObjAssetType[]
 */
export const dedupeAssets = (
	assets: FungibleStrAssetType[] | FungibleObjAssetType[],
): FungibleStrAssetType[] | FungibleObjAssetType[] => {
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

	if (typeof assets[0].fun.Fungible === 'string') {
		return dedupedAssets as FungibleStrAssetType[];
	}

	return dedupedAssets as FungibleObjAssetType[];
};
