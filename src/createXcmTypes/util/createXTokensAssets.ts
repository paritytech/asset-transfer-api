import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { XCMAssetRegistryMultiLocation } from '../../registry/types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	CreateAssetsOpts,
	FungibleObjAsset,
	FungibleObjAssetType,
	FungibleObjMultiAsset,
	UnionXcAssetsMultiAssets,
} from '../types.js';
import { dedupeAssets } from './dedupeAssets.js';
import { getXcAssetMultiLocationByAssetId } from './getXcAssetMultiLocationByAssetId.js';
import { sortAssetsAscending } from './sortAssetsAscending.js';

/**
 * Create `xTokens` MultiAssets.
 *
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param xcmVersion The accepted xcm version.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param opts Options used to create xTokens `MultiAssets`.
 */
export const createXTokensMultiAssets = async ({
	amounts,
	assets,
	opts: { api, registry },
	specName,
	xcmVersion,
}: {
	amounts: string[];
	assets: string[];
	opts: CreateAssetsOpts;
	specName: string;
	xcmVersion: number;
}): Promise<UnionXcAssetsMultiAssets> => {
	let multiAssets: FungibleObjAssetType[] = [];
	let multiAsset: FungibleObjAssetType;

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		const assetId = assets[i];

		const xcAssetMultiLocationStr = await getXcAssetMultiLocationByAssetId(
			api,
			assetId,
			specName,
			xcmVersion,
			registry,
		);
		const parsedMultiLocation = JSON.parse(xcAssetMultiLocationStr) as XCMAssetRegistryMultiLocation;
		const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

		const concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);

		// TODO: consolidate multiAssets creation. This is duplicated a good bit
		if ([2, 3].includes(xcmVersion)) {
			multiAsset = {
				id: {
					Concrete: concreteMultiLocation,
				},
				fun: {
					Fungible: { Fungible: amount },
				},
			};
		} else if ([4, 5].includes(xcmVersion)) {
			multiAsset = {
				id: concreteMultiLocation,
				fun: {
					Fungible: { Fungible: amount },
				},
			};
		} else {
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
		}

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleObjAssetType[];
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleObjAssetType[];

	switch (xcmVersion) {
		case 2:
			return Promise.resolve({
				V2: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[],
			});
		case 3:
			return Promise.resolve({
				V3: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[],
			});
		case 4:
			return Promise.resolve({
				V4: sortedAndDedupedMultiAssets as FungibleObjAsset[],
			});
		case 5:
			return Promise.resolve({
				V5: sortedAndDedupedMultiAssets as FungibleObjAsset[],
			});
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
