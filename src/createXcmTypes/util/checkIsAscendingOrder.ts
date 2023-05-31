// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

/**
 * This returns whether a given multiasset array sorted in ascending order.
 *
 * @param multiAssets MultiAsset[]
 */
export const isAscendingOrder = (multiAssets: MultiAsset[]): boolean => {
	if (multiAssets.length === 0) {
		return true;
	}

	return multiAssets.every((asset, idx) => {
		return (
			idx === 0 ||
			BigInt(asset.fun.Fungible) >= BigInt(multiAssets[idx - 1].fun.Fungible)
		);
	});
};
