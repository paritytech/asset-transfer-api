import { AnyJson } from '@polkadot/types-codec/types';

import { XCMAssetRegistryMultiLocation } from '../../registry/types.js';
import { Direction } from '../../types.js';
import {
	CreateAssetsOpts,
	FungibleAssetType,
	UnionXcAssetsMultiAsset,
	UnionXcAssetsMultiAssets,
	XcmCreator,
} from '../types.js';
import { dedupeAssets } from './dedupeAssets.js';
import { getXcAssetMultiLocationByAssetId } from './getXcAssetMultiLocationByAssetId.js';
import { isParachainPrimaryNativeAsset } from './isParachainPrimaryNativeAsset.js';
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
	xcmCreator,
}: {
	amounts: string[];
	assets: string[];
	opts: CreateAssetsOpts;
	specName: string;
	xcmCreator: XcmCreator;
}): Promise<UnionXcAssetsMultiAssets> => {
	let multiAssets: FungibleAssetType[] = [];

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		const assetId = assets[i];

		const xcAssetMultiLocationStr = await getXcAssetMultiLocationByAssetId({
			api,
			assetId,
			specName,
			xcmCreator,
			registry,
		});
		const parsedMultiLocation = JSON.parse(xcAssetMultiLocationStr) as XCMAssetRegistryMultiLocation;
		const multiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

		const multiAsset = xcmCreator.fungibleAsset({ amount, multiLocation });
		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets);
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets);

	return xcmCreator.multiAssets(sortedAndDedupedMultiAssets);
};

/**
 * Create a single xToken asset.
 *
 * @param amount Amount per asset. This will be of length 1.
 * @param xcmVersion The accepted xcm version.
 * @param specName The specname of the chain the api is connected to.
 * @param assetId Single asset to be created into a `MultiAsset`.
 * @param opts Options to create a single Asset.
 */
export const createXTokensAsset = async ({
	amount,
	assetId,
	opts: { api, registry },
	specName,
	xcmCreator,
}: {
	amount: string;
	assetId: string;
	opts: CreateAssetsOpts;
	specName: string;
	xcmCreator: XcmCreator;
}): Promise<UnionXcAssetsMultiAsset> => {
	let multiAsset: FungibleAssetType | undefined;

	// check if asset is the parachains primary native asset
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToPara,
		assetId,
	);

	if (isPrimaryParachainNativeAsset) {
		const multiLocation = xcmCreator.hereDest({ parents: 0 });
		multiAsset = xcmCreator.fungibleAsset({ amount, multiLocation });
	} else {
		const xcAssetMultiLocationStr = await getXcAssetMultiLocationByAssetId({
			api,
			assetId,
			specName,
			xcmCreator,
			registry,
		});
		const parsedMultiLocation = JSON.parse(xcAssetMultiLocationStr) as XCMAssetRegistryMultiLocation;
		const multiLocation = parsedMultiLocation.v1 as unknown as AnyJson;
		multiAsset = xcmCreator.fungibleAsset({ amount, multiLocation });
	}

	return xcmCreator.multiAsset(multiAsset);
};

export const createXTokensAssetToRelay = ({
	amount,
	parents,
	xcmCreator,
}: {
	amount: string;
	parents: number;
	xcmCreator: XcmCreator;
}): UnionXcAssetsMultiAsset => {
	const multiLocation: AnyJson = {
		Parents: parents,
		Interior: { Here: null },
	};
	const multiAsset = xcmCreator.fungibleAsset({ amount, multiLocation });
	return xcmCreator.multiAsset(multiAsset);
};
