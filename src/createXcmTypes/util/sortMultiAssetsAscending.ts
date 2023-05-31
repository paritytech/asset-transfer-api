// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

/**
 * This sorts a list of multiassets in ascending order based on their Fungible value.
 *
 * @param multiAssets MultiAsset[]
 */
export const sortMultiAssetsAscending = (multiAssets: MultiAsset[]) => {
	multiAssets.sort((a, b) => {
		const sortOrder = BigInt(a.fun.Fungible) < BigInt(b.fun.Fungible) ? -1 : 1;

		return sortOrder;
	});
};
