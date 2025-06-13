import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { XCMAssetRegistryMultiLocation } from '../../registry/types.js';
import { Direction } from '../../types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	CreateAssetsOpts,
	FungibleObjAsset,
	FungibleObjAssetType,
	FungibleObjMultiAsset,
	UnionXcAssetsMultiAsset,
	UnionXcAssetsMultiAssets,
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
	xcmVersion,
}: {
	amounts: string[];
	assets: string[];
	opts: CreateAssetsOpts;
	specName: string;
	xcmVersion: number;
}): Promise<UnionXcAssetsMultiAssets> => {
	let multiAssets: FungibleObjAssetType[] = [];

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
		const multiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

		const multiAsset = createMultiAsset({ amount, multiLocation, xcmVersion });
		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleObjAssetType[];
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleObjAssetType[];

	switch (xcmVersion) {
		case 2:
			return { V2: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[] };
		case 3:
			return { V3: sortedAndDedupedMultiAssets as FungibleObjMultiAsset[] };
		case 4:
			return { V4: sortedAndDedupedMultiAssets as FungibleObjAsset[] };
		case 5:
			return { V5: sortedAndDedupedMultiAssets as FungibleObjAsset[] };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
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
	xcmVersion,
}: {
	amount: string;
	assetId: string;
	opts: CreateAssetsOpts;
	specName: string;
	xcmVersion: number;
}): Promise<UnionXcAssetsMultiAsset> => {
	let multiAsset: FungibleObjAssetType | undefined;

	// check if asset is the parachains primary native asset
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToPara,
		assetId,
	);

	if (isPrimaryParachainNativeAsset) {
		let multiLocation: AnyJson;
		if ([2, 3].includes(xcmVersion)) {
			multiLocation = { parents: 0, interior: { Here: '' } };
		} else if ([4, 5].includes(xcmVersion)) {
			multiLocation = { parents: 0, interior: { X1: [{ Here: '' }] } };
		} else {
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
		}
		multiAsset = createMultiAsset({ amount, multiLocation, xcmVersion });
	} else {
		const xcAssetMultiLocationStr = await getXcAssetMultiLocationByAssetId(
			api,
			assetId,
			specName,
			xcmVersion,
			registry,
		);
		const parsedMultiLocation = JSON.parse(xcAssetMultiLocationStr) as XCMAssetRegistryMultiLocation;
		const multiLocation = parsedMultiLocation.v1 as unknown as AnyJson;
		multiAsset = createMultiAsset({ amount, multiLocation, xcmVersion });
	}

	switch (xcmVersion) {
		case 2:
			return { V2: multiAsset as FungibleObjMultiAsset };
		case 3:
			return { V3: multiAsset as FungibleObjMultiAsset };
		case 4:
			return { V4: multiAsset as FungibleObjAsset };
		case 5:
			return { V5: multiAsset as FungibleObjAsset };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};

export const createXTokensAssetToRelay = async ({
	amount,
	parents,
	xcmVersion,
}: {
	amount: string;
	parents: number;
	xcmVersion: number;
}): Promise<UnionXcAssetsMultiAsset> => {
	const multiLocation: AnyJson = {
		Parents: parents,
		Interior: { Here: null },
	};
	const multiAsset = createMultiAsset({ amount, multiLocation, xcmVersion });
	switch (xcmVersion) {
		case 2:
			return Promise.resolve({ V2: multiAsset as FungibleObjMultiAsset });
		case 3:
			return Promise.resolve({ V3: multiAsset as FungibleObjMultiAsset });
		case 4:
			return Promise.resolve({ V4: multiAsset as FungibleObjAsset });
		case 5:
			return Promise.resolve({ V5: multiAsset as FungibleObjAsset });
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};

const createMultiAsset = ({
	amount,
	multiLocation,
	xcmVersion,
}: {
	amount: string;
	multiLocation: AnyJson;
	xcmVersion: number;
}): FungibleObjAssetType => {
	const concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);

	// TODO: consolidate multiAssets creation. This is duplicated a good bit
	if ([2, 3].includes(xcmVersion)) {
		return {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};
	} else if ([4, 5].includes(xcmVersion)) {
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: { Fungible: amount },
			},
		};
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
