// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import { DEFAULT_XCM_VERSION } from '../consts.js';
import { Registry } from '../registry/index.js';
import { XCMAssetRegistryMultiLocation } from '../registry/types.js';
import { Direction } from '../types.js';
import { resolveMultiLocation } from '../util/resolveMultiLocation.js';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleAssetType,
	FungibleMultiAsset,
	ICreateXcmType,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
} from './types.js';
import { createAssets } from './util/createAssets.js';
import { createBeneficiary } from './util/createBeneficiary.js';
import { createParachainDest } from './util/createDest.js';
import { createFeeAssetItem } from './util/createFeeAssetItem.js';
import { createMultiAsset } from './util/createMultiAsset.js';
import { createWeightLimit } from './util/createWeightLimit.js';
import { dedupeAssets } from './util/dedupeAssets.js';
import { getParachainNativeAssetLocation } from './util/getParachainNativeAssetLocation.js';
import { getXcAssetMultiLocationByAssetId } from './util/getXcAssetMultiLocationByAssetId.js';
import { isParachainPrimaryNativeAsset } from './util/isParachainPrimaryNativeAsset.js';
import { sortAssetsAscending } from './util/sortAssetsAscending.js';

export const ParaToEthereum: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary,
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param destId The parachain Id of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (destId: string, xcmVersion: number = DEFAULT_XCM_VERSION): XcmDestBeneficiary => {
		return createParachainDest({
			destId,
			parents: 1,
			xcmVersion,
		});
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assets The assets to create into xcm `MultiAssets`.
	 * @param opts Options regarding the registry, and types of asset transfers.
	 */
	createAssets: async (
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> => {
		return createAssets({
			amounts,
			xcmVersion,
			specName,
			assets,
			opts,
			multiAssetCreator: createParaToEthereumMultiAssets,
		});
	},
	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit,
	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 * @param opts Options that are used for fee asset construction.
	 */
	createFeeAssetItem: async (api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<number> => {
		return createFeeAssetItem({
			api,
			opts,
			multiAssetCreator: createParaToEthereumMultiAssets,
		});
	},
};

/**
 * Create multiassets for ParaToEthereum direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param xcmVersion The accepted xcm version.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
const createParaToEthereumMultiAssets = async ({
	api,
	amounts,
	specName,
	assets,
	xcmVersion,
	registry,
	destChainId,
}: {
	api: ApiPromise;
	amounts: string[];
	specName: string;
	assets: string[];
	xcmVersion: number;
	registry: Registry;
	destChainId?: string;
}): Promise<FungibleAssetType[]> => {
	const multiAssets: FungibleAssetType[] = [];
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToEthereum,
		assets[0],
	);

	if (isPrimaryParachainNativeAsset) {
		const multiLocation = resolveMultiLocation(
			getParachainNativeAssetLocation(registry, assets[0], destChainId),
			xcmVersion,
		);

		const multiAsset = createMultiAsset({
			amount: amounts[0],
			multiLocation,
			xcmVersion,
		});

		multiAssets.push(multiAsset);
	} else {
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

			const multiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);
			const multiAsset = createMultiAsset({
				amount,
				multiLocation,
				xcmVersion,
			});

			multiAssets.push(multiAsset);
		}
	}

	const sortedAssets = sortAssetsAscending(multiAssets);
	const sortedAndDedupedMultiAssets = dedupeAssets(sortedAssets) as FungibleMultiAsset[];

	return sortedAndDedupedMultiAssets;
};
