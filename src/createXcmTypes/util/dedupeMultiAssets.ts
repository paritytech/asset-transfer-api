// Copyright 2023 Parity Technologies (UK) Ltd.

import type { FungibleObjMultiAsset, FungibleStrMultiAsset } from '../../createXcmTypes/types';

/**
 * This removes duplicate multi assets when given a sorted list
 *
 * @param multiAssets MulitAsset[]
 */
export const dedupeMultiAssets = (
	multiAssets: FungibleStrMultiAsset[] | FungibleObjMultiAsset[]
): FungibleStrMultiAsset[] | FungibleObjMultiAsset[] => {
	const dedupedAssets = [];

	for (let i = 0; i < multiAssets.length; i++) {
		const multiAsset = multiAssets[i];

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

	if (typeof multiAssets[0].fun.Fungible === 'string') {
		return dedupedAssets as FungibleStrMultiAsset[];
	}

	return dedupedAssets as FungibleObjMultiAsset[];
};
