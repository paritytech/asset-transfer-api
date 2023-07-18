// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

/**
 * This sorts a list of multiassets in ascending order based on their id.
 *
 * @param multiAssets MultiAsset[]
 */
export const sortMultiAssetsAscending = (multiAssets: MultiAsset[]) => {
	return multiAssets.sort((a, b) => {
		const isAHere = a.id.Concrete.interior.isHere;
		const isBHere = b.id.Concrete.interior.isHere;
		if (isAHere) {
			return 1;
		} else if (isBHere) {
			return -1;
		}

		const sortOrder = a.id.Concrete.interior > b.id.Concrete.interior ? 1 : -1;

		return sortOrder;
	});
};
