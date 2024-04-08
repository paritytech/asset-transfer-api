// Copyright 2024 Parity Technologies (UK) Ltd.

import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import {
	type FungibleObjAsset,
	type FungibleObjAssetType,
	type FungibleObjMultiAsset,
	type UnionXcAssetsMultiAssets,
} from '../types';
import { dedupeAssets } from './dedupeAssets';
import { sortAssetsAscending } from './sortAssetsAscending';

export const createClaimableAssetLocations = async (
	assetLocations: string[],
	amounts: string[],
	xcmVersion: number,
): Promise<UnionXcAssetsMultiAssets> => {
	let multiAssets: FungibleObjAssetType[] = [];
	let multiAsset: FungibleObjAssetType;

	for (let i = 0; i < assetLocations.length; i++) {
		const amount = amounts[i];
		const location = assetLocations[i];

		const concreteMultiLocation = resolveMultiLocation(location, xcmVersion);

		if (xcmVersion < 4) {
			multiAsset = {
				id: {
					Concrete: concreteMultiLocation,
				},
				fun: {
					Fungible: { Fungible: amount },
				},
			};
		} else {
			multiAsset = {
				id: concreteMultiLocation,
				fun: {
					Fungible: { Fungible: amount },
				},
			};
		}

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleObjAssetType[];
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleObjAssetType[];
	if (xcmVersion === 2) {
		return Promise.resolve({
			V2: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[],
		});
	} else if (xcmVersion === 3) {
		return Promise.resolve({
			V3: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[],
		});
	} else {
		return Promise.resolve({
			V4: sortedAndDedupedMultiAssets as FungibleObjAsset[],
		});
	}
};
