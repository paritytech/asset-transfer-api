import type { ApiPromise } from '@polkadot/api';

import type { Registry } from '../../registry/index.js';
import { validateNumber } from '../../validate/index.js';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleAssetType,
	OneOfXcmJunctions,
	XcmCreator,
	XcmMultiAssets,
	XcmMultiLocation,
	XcmVersionedMultiLocation,
} from '../types.js';
import { createAssets } from '../util/createAssets.js';
import { createFeeAssetItem } from '../util/createFeeAssetItem.js';
import { dedupeAssets } from '../util/dedupeAssets.js';
import { fetchPalletInstanceId } from '../util/fetchPalletInstanceId.js';
import { getAssetId } from '../util/getAssetId.js';
import { isRelayNativeAsset } from '../util/isRelayNativeAsset.js';
import { sortAssetsAscending } from '../util/sortAssetsAscending.js';
import { DefaultHandler } from './default.js';

export class SystemToBridge extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 */
	createDest(destId: string): XcmVersionedMultiLocation {
		return this.xcmCreator.interiorDest({
			destId,
			parents: 2,
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
			multiAssetCreator: createSystemToBridgeAssets,
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
			multiAssetCreator: createSystemToBridgeAssets,
			verifySystemChain: true,
			xcmCreator: this.xcmCreator,
		});
	}
}

/**
 * Create multiassets for SystemToBridge direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
const createSystemToBridgeAssets = async ({
	api,
	amounts,
	specName,
	assets,
	registry,
	isForeignAssetsTransfer,
	isLiquidTokenTransfer,
	xcmCreator,
}: {
	api: ApiPromise;
	amounts: string[];
	specName: string;
	assets: string[];
	registry: Registry;
	destChainId?: string;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
	xcmCreator: XcmCreator;
}): Promise<FungibleAssetType[]> => {
	let multiAssets: FungibleAssetType[] = [];

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const palletId = fetchPalletInstanceId(api, assetId, isLiquidTokenTransfer, isForeignAssetsTransfer);

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(registry, assetId);
		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId({
				api,
				registry,
				asset: assetId,
				specName,
				xcmCreator,
				isForeignAssetsTransfer,
			});
		}

		let multiLocation: XcmMultiLocation;

		if (isForeignAssetsTransfer) {
			multiLocation = xcmCreator.resolveMultiLocation(assetId);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: OneOfXcmJunctions = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
					};

			multiLocation = {
				parents,
				interior,
			};
		}

		const multiAsset = xcmCreator.fungibleAsset({
			amount,
			multiLocation,
		});
		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets);

	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};
