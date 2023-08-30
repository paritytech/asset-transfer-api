// Copyright 2023 Parity Technologies (UK) Ltd.

import { JunctionV1 } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types-codec/types';
import { BN } from 'bn.js';

import { MultiAsset, XcmMultiAsset } from '../../types';
import { validateNumber } from '../../validate';

/**
 * This sorts a list of multiassets in ascending order based on their id.
 *
 * @param multiAssets MultiAsset[]
 */
export const sortMultiAssetsAscending = (
	multiAssets: MultiAsset[] | XcmMultiAsset[]
) => {
	return multiAssets.sort((a, b) => {
		let parentSortOrder = 0; // sort order based on parents value
		let interiorMultiLocationTypeSortOrder = 0; // sort order based on interior multilocation type value (e.g. X1 < X2)
		let interiorMultiLocationSortOrder = 0; // sort order based on multilocation junction values
		let fungibleSortOrder = 0; // sort order based on fungible value
		if (
			typeof a.fun.Fungible === 'string' &&
			typeof b.fun.Fungible === 'string'
		) {
			fungibleSortOrder = (a as MultiAsset).fun.Fungible.localeCompare(
				(b as MultiAsset).fun.Fungible
			);
		} else {
			fungibleSortOrder = (
				a as XcmMultiAsset
			).fun.Fungible.Fungible.localeCompare(
				(b as XcmMultiAsset).fun.Fungible.Fungible
			);
		}

		if (a.id.Concrete.parents < b.id.Concrete.parents) {
			parentSortOrder = -1;
		} else if (a.id.Concrete.parents > b.id.Concrete.parents) {
			parentSortOrder = 1;
		}

		if (a.id.Concrete.interior.type < b.id.Concrete.interior.type) {
			interiorMultiLocationTypeSortOrder = -1;
		} else if (a.id.Concrete.interior.type > b.id.Concrete.interior.type) {
			interiorMultiLocationTypeSortOrder = 1;
		}

		if (a.id.Concrete.interior.type === b.id.Concrete.interior.type) {
			interiorMultiLocationSortOrder = getSameJunctionMultiLocationSortOrder(
				a,
				b
			);
		}

		return (
			parentSortOrder ||
			interiorMultiLocationTypeSortOrder ||
			interiorMultiLocationSortOrder ||
			fungibleSortOrder
		);
	});
};

const getSameJunctionMultiLocationSortOrder = (
	a: MultiAsset | XcmMultiAsset,
	b: MultiAsset | XcmMultiAsset
): number => {
	let sortOrder = 0;

	switch (a.id.Concrete.interior.type) {
		case 'X1':
			if (
				a.id.Concrete.interior.asX1.type === b.id.Concrete.interior.asX1.type &&
				!a.id.Concrete.interior.asX1.eq(b.id.Concrete.interior.asX1)
			) {
				if (
					a.id.Concrete.interior.asX1.value < a.id.Concrete.interior.asX1.value
				) {
					return -1;
				} else if (
					a.id.Concrete.interior.asX1.value > b.id.Concrete.interior.asX1.value
				) {
					return 1;
				}
			} else if (!a.id.Concrete.interior.asX1.eq(b.id.Concrete.interior.asX1)) {
				// for junctions of different types we compare the junction values themselves
				if (
					MultiLocationJunctionType[a.id.Concrete.interior.asX1.type] <
					MultiLocationJunctionType[b.id.Concrete.interior.asX1.type]
				) {
					return -1;
				} else if (
					MultiLocationJunctionType[a.id.Concrete.interior.asX1.type] >
					MultiLocationJunctionType[b.id.Concrete.interior.asX1.type]
				) {
					return 1;
				}
			}
			break;
		case 'X2':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX2,
				b.id.Concrete.interior.asX2
			);
			break;
		case 'X3':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX3,
				b.id.Concrete.interior.asX3
			);
			break;
		case 'X4':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX4,
				b.id.Concrete.interior.asX4
			);
			break;
		case 'X5':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX5,
				b.id.Concrete.interior.asX5
			);
			break;
		case 'X6':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX6,
				b.id.Concrete.interior.asX6
			);
			break;
		case 'X7':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX7,
				b.id.Concrete.interior.asX7
			);
			break;
		case 'X8':
			sortOrder = getSortOrderForX2ThroughX8(
				a.id.Concrete.interior.asX8,
				b.id.Concrete.interior.asX8
			);
	}

	return sortOrder;
};

type MultiLocationJunctions =
	| [JunctionV1, JunctionV1]
	| [JunctionV1, JunctionV1, JunctionV1]
	| [JunctionV1, JunctionV1, JunctionV1, JunctionV1]
	| [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
	| [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
	| [
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1
	  ]
	| [
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1,
			JunctionV1
	  ];

enum MultiLocationJunctionType {
	Parachain,
	AccountId32,
	AccountIndex64,
	AccountKey20,
	PalletInstance,
	GeneralIndex,
	GeneralKey,
	OnlyChild,
	Plurality,
}

const getSortOrderForX2ThroughX8 = (
	a: ITuple<MultiLocationJunctions>,
	b: ITuple<MultiLocationJunctions>
): number => {
	for (let i = 0; i < a.length; i++) {
		const junctionA = a[i];
		const junctionB = b[i];

		// if the junctions are the same type but not equal
		// we compare the inner values in order to determine sort order
		if (junctionA.type === junctionB.type && !junctionA.eq(junctionB)) {
			const junctionAIsValidInt = validateNumber(junctionA.value.toString());
			const junctionBIsValidInt = validateNumber(junctionB.value.toString());

			// compare number values if both junction values are valid integers
			// otherwise compare the lexicographical values
			if (junctionAIsValidInt && junctionBIsValidInt) {
				const junctionAValueAsBN = new BN(junctionA.value.toString());
				const junctionBValueAsBN = new BN(junctionB.value.toString());
				if (junctionAValueAsBN.lt(junctionBValueAsBN)) {
					return -1;
				} else if (junctionAValueAsBN.gt(junctionBValueAsBN)) {
					return 1;
				}
			} else {
				if (junctionA.value < junctionB.value) {
					return -1;
				} else if (junctionA.value > junctionB.value) {
					return 1;
				}
			}
		} else if (!junctionA.eq(junctionB)) {
			// for junctions of different types we compare the junction values themselves
			if (
				MultiLocationJunctionType[junctionA.type] <
				MultiLocationJunctionType[junctionB.type]
			) {
				return -1;
			} else if (
				MultiLocationJunctionType[junctionA.type] >
				MultiLocationJunctionType[junctionB.type]
			) {
				return 1;
			}
		}
	}

	return 0;
};
