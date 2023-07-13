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

		if (
			a.id.Concrete.interior.isX1 &&
			a.id.Concrete.interior.asX1.isGeneralKey
		) {
			return 1;
		} else if (
			b.id.Concrete.interior.isX1 &&
			b.id.Concrete.interior.asX1.isGeneralKey
		) {
			return -1;
		}

		const sortOrder =
			BigInt(
				a.id.Concrete.interior.isX2 &&
					a.id.Concrete.interior.asX2[1].isGeneralIndex &&
					a.id.Concrete.interior.asX2[1].asGeneralIndex.toNumber()
			) <
			BigInt(
				b.id.Concrete.interior.isX2 &&
					b.id.Concrete.interior.asX2[1].isGeneralIndex &&
					b.id.Concrete.interior.asX2[1].asGeneralIndex.toNumber()
			)
				? -1
				: 1;

		return sortOrder;
	});
};
