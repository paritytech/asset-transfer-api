// Copyright 2023 Parity Technologies (UK) Ltd.

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
import { stringToHex } from '@polkadot/util';
import { BN } from 'bn.js';

import type {
	FungibleObjMultiAsset,
	FungibleStrMultiAsset,
	XcmV2Junction,
	XcmV3Junction,
} from '../../createXcmTypes/types';
import { validateNumber } from '../../validate';

/**
 * This sorts a list of multiassets in ascending order based on their id.
 *
 * @param multiAssets MultiAsset[]
 */
export const sortMultiAssetsAscending = (multiAssets: FungibleStrMultiAsset[] | FungibleObjMultiAsset[]) => {
	return multiAssets.sort((a, b) => {
		let parentSortOrder = 0; // sort order based on parents value
		let interiorMultiLocationTypeSortOrder = 0; // sort order based on interior multilocation type value (e.g. X1 < X2)
		let interiorMultiLocationSortOrder = 0; // sort order based on multilocation junction values
		let fungibleSortOrder = 0; // sort order based on fungible value
		if (typeof a.fun.Fungible === 'string' && typeof b.fun.Fungible === 'string') {
			fungibleSortOrder = (a as FungibleStrMultiAsset).fun.Fungible.localeCompare(
				(b as FungibleStrMultiAsset).fun.Fungible,
			);
		} else {
			fungibleSortOrder = (a as FungibleObjMultiAsset).fun.Fungible.Fungible.localeCompare(
				(b as FungibleObjMultiAsset).fun.Fungible.Fungible,
			);
		}

		const aParents = (a.id.Concrete.parents || a.id.Concrete['Parents']) as string | number;
		const bParents = (b.id.Concrete.parents || b.id.Concrete['Parents']) as string | number;
		if (aParents < bParents) {
			parentSortOrder = -1;
		} else if (aParents > bParents) {
			parentSortOrder = 1;
		}

		const aInterior = a.id.Concrete.interior || a.id.Concrete['Interior'];
		const bInterior = b.id.Concrete.interior || b.id.Concrete['Interior'];
		const aInteriorType = Object.keys(aInterior)[0];
		const bInteriorType = Object.keys(bInterior)[0];
		if (aInteriorType < bInteriorType) {
			interiorMultiLocationTypeSortOrder = -1;
		} else if (aInteriorType > bInteriorType) {
			interiorMultiLocationTypeSortOrder = 1;
		}

		if (aInteriorType === bInteriorType) {
			interiorMultiLocationSortOrder = getSameJunctionMultiLocationSortOrder(a, b);
		}

		return parentSortOrder || interiorMultiLocationTypeSortOrder || interiorMultiLocationSortOrder || fungibleSortOrder;
	});
};

const getSameJunctionMultiLocationSortOrder = (
	a: FungibleStrMultiAsset | FungibleObjMultiAsset,
	b: FungibleStrMultiAsset | FungibleObjMultiAsset,
): number => {
	let sortOrder = 0;

	const aInterior = a.id.Concrete.interior || a.id.Concrete['Interior'];
	const bInterior = b.id.Concrete.interior || b.id.Concrete['Interior'];
	switch (Object.keys(aInterior)[0]) {
		case 'X1':
			const aX1Type = Object.keys(aInterior.X1!)[0];
			const bX1Type = Object.keys(bInterior.X1!)[0];
			if (aX1Type === bX1Type && aInterior.X1 !== bInterior.X1) {
				const aHex = stringToHex(JSON.stringify(aInterior.X1));
				const bHex = stringToHex(JSON.stringify(bInterior.X1));
				if (aHex < bHex) {
					return -1;
				} else if (aHex > bHex) {
					return 1;
				}
			} else if (aInterior.X1 !== bInterior.X1) {
				// for junctions of different types we compare the junction values themselves
				if (MultiLocationJunctionType[aX1Type] < MultiLocationJunctionType[bX1Type]) {
					return -1;
				} else if (MultiLocationJunctionType[aX1Type] > MultiLocationJunctionType[bX1Type]) {
					return 1;
				}
			}
			break;
		case 'X2':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X2!, bInterior.X2!);
			break;
		case 'X3':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X3!, bInterior.X3!);
			break;
		case 'X4':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X4!, bInterior.X4!);
			break;
		case 'X5':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X5!, bInterior.X5!);
			break;
		case 'X6':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X6!, bInterior.X6!);
			break;
		case 'X7':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X7!, bInterior.X7!);
			break;
		case 'X8':
			sortOrder = getSortOrderForX2ThroughX8(aInterior.X8!, bInterior.X8!);
	}

	return sortOrder;
};

type UnionJunction = XcmV3Junction | XcmV2Junction;

type MultiLocationJunctions =
	| [UnionJunction, UnionJunction]
	| [UnionJunction, UnionJunction, UnionJunction]
	| [UnionJunction, UnionJunction, UnionJunction, UnionJunction]
	| [UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction]
	| [UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction]
	| [UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction, UnionJunction]
	| [
			UnionJunction,
			UnionJunction,
			UnionJunction,
			UnionJunction,
			UnionJunction,
			UnionJunction,
			UnionJunction,
			UnionJunction,
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
	GlobalConsensus,
}

const getSortOrderForX2ThroughX8 = (a: MultiLocationJunctions, b: MultiLocationJunctions): number => {
	for (let i = 0; i < a.length; i++) {
		const junctionA = a[i];
		const junctionB = b[i];
		const junctionAType = Object.keys(junctionA)[0];
		const junctionBType = Object.keys(junctionB)[0];

		// if the junctions are the same type but not equal
		// we compare the inner values in order to determine sort order
		if (junctionAType === junctionBType && junctionA !== junctionB) {
			const junctionAValue = Object.values(junctionA)[0];
			const junctionBValue = Object.values(junctionB)[0];
			const junctionAIsValidInt = validateNumber(junctionAValue as string);
			const junctionBIsValidInt = validateNumber(junctionBValue as string);

			// compare number values if both junction values are valid integers
			// otherwise compare the lexicographical values
			if (junctionAIsValidInt && junctionBIsValidInt) {
				const junctionAValueAsBN = new BN(Number.parseInt(junctionAValue as string));
				const junctionBValueAsBN = new BN(Number.parseInt(junctionBValue as string));
				if (junctionAValueAsBN.lt(junctionBValueAsBN)) {
					return -1;
				} else if (junctionAValueAsBN.gt(junctionBValueAsBN)) {
					return 1;
				}
			} else {
				const aHex = stringToHex(JSON.stringify(junctionA));
				const bHex = stringToHex(JSON.stringify(junctionB));
				if (aHex < bHex) {
					return -1;
				} else if (aHex > bHex) {
					return 1;
				}
			}
		} else if (junctionA !== junctionB) {
			// for junctions of different types we compare the junction values themselves
			if (MultiLocationJunctionType[junctionAType] < MultiLocationJunctionType[junctionBType]) {
				return -1;
			} else if (MultiLocationJunctionType[junctionAType] > MultiLocationJunctionType[junctionBType]) {
				return 1;
			}
		}
	}

	return 0;
};
