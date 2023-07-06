// Copyright 2023 Parity Technologies (UK) Ltd.

import {
	GeneralKeyInterior,
	MultiAsset,
	NonRelayNativeInterior,
} from '../../types';

/**
 * This sorts a list of multiassets in ascending order based on their id.
 *
 * @param multiAssets MultiAsset[]
 */
export const sortMultiAssetsAscending = (multiAssets: MultiAsset[]) => {
	return multiAssets.sort((a, b) => {
		const isAHere = Object.keys(a.id.Concrete.interior).includes('Here');
		const isBHere = Object.keys(b.id.Concrete.interior).includes('Here');
		if (isAHere) {
			return 1;
		} else if (isBHere) {
			return -1;
		}

		if ((a.id.Concrete.interior as GeneralKeyInterior).X2[0].GeneralKey) {
			return 1;
		} else if (
			(b.id.Concrete.interior as GeneralKeyInterior).X2[0].GeneralKey
		) {
			return -1;
		}

		const sortOrder =
			BigInt(
				(a.id.Concrete.interior as NonRelayNativeInterior).X2[1].GeneralIndex
			) <
			BigInt(
				(b.id.Concrete.interior as NonRelayNativeInterior).X2[1].GeneralIndex
			)
				? -1
				: 1;

		return sortOrder;
	});
};
