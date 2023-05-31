// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

/**
 * This fetches the metadata for the chain we are connected to and searches for the Assets pallet and returns its index.
 *
 * @param multiAssets MultiAsset[]
 */
export const isAscendingOrder = (Assets: MultiAsset[]): boolean => {
	if (Assets.length === 0) {
		return true;
	}

	return Assets.every((asset, idx) => {
		return (
			idx === 0 ||
			BigInt(asset.fun.Fungible) >= BigInt(Assets[idx - 1].fun.Fungible)
		);
	});
};
