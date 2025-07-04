import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import { Registry } from '../../registry/index.js';
import { XCMAssetRegistryMultiLocation } from '../../registry/types.js';
import { Direction } from '../../types.js';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleAssetType,
	FungibleMultiAsset,
	XcmCreator,
	XcmMultiAssets,
	XcmVersionedMultiLocation,
} from '../types.js';
import { createAssets } from '../util/createAssets.js';
import { createFeeAssetItem } from '../util/createFeeAssetItem.js';
import { dedupeAssets } from '../util/dedupeAssets.js';
import { getParachainNativeAssetLocation } from '../util/getParachainNativeAssetLocation.js';
import { getXcAssetMultiLocationByAssetId } from '../util/getXcAssetMultiLocationByAssetId.js';
import { isParachainPrimaryNativeAsset } from '../util/isParachainPrimaryNativeAsset.js';
import { sortAssetsAscending } from '../util/sortAssetsAscending.js';
import { DefaultHandler } from './default.js';

export class ParaToEthereum extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param destId The parachain Id of the destination.
	 */
	createDest(destId: string): XcmVersionedMultiLocation {
		return this.xcmCreator.parachainDest({
			destId,
			parents: 1,
		});
	}
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assets The assets to create into xcm `MultiAssets`.
	 * @param opts Options regarding the registry, and types of asset transfers.
	 */
	async createAssets(
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<XcmMultiAssets> {
		return createAssets({
			amounts,
			specName,
			assets,
			opts,
			multiAssetCreator: createParaToEthereumMultiAssets,
			xcmCreator: this.xcmCreator,
		});
	}

	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 * @param opts Options that are used for fee asset construction.
	 */
	async createFeeAssetItem(api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<number> {
		return createFeeAssetItem({
			api,
			opts,
			multiAssetCreator: createParaToEthereumMultiAssets,
			xcmCreator: this.xcmCreator,
		});
	}
}

/**
 * Create multiassets for ParaToEthereum direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
const createParaToEthereumMultiAssets = async ({
	api,
	amounts,
	specName,
	assets,
	registry,
	destChainId,
	xcmCreator,
}: {
	api: ApiPromise;
	amounts: string[];
	specName: string;
	assets: string[];
	registry: Registry;
	destChainId?: string;
	xcmCreator: XcmCreator;
}): Promise<FungibleAssetType[]> => {
	const multiAssets: FungibleAssetType[] = [];
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToEthereum,
		assets[0],
	);

	if (isPrimaryParachainNativeAsset) {
		const multiLocation = xcmCreator.resolveMultiLocation(
			getParachainNativeAssetLocation({ registry, nativeAssetSymbol: assets[0], destChainId, xcmCreator }),
		);

		const multiAsset = xcmCreator.fungibleAsset({
			amount: amounts[0],
			multiLocation,
		});

		multiAssets.push(multiAsset);
	} else {
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
			const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

			const multiLocation = xcmCreator.resolveMultiLocation(xcAssetMultiLocation);
			const multiAsset = xcmCreator.fungibleAsset({
				amount,
				multiLocation,
			});

			multiAssets.push(multiAsset);
		}
	}

	const sortedAssets = sortAssetsAscending(multiAssets);
	const sortedAndDedupedMultiAssets = dedupeAssets(sortedAssets) as FungibleMultiAsset[];

	return sortedAndDedupedMultiAssets;
};
