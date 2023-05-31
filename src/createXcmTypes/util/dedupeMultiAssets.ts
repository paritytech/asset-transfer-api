// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

/**
 * This removes duplicate multi assets when given a sorted list
 *
 * @param multiAssets MulitAsset[]
 */
export const dedupeMultiAssets = (multiAssets: MultiAsset[]): MultiAsset[] => {
	const dedupedAssets: MultiAsset[] = [];

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

	return dedupedAssets;
};
