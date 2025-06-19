import type { ApiPromise } from '@polkadot/api';

import type { Registry } from '../../registry/index.js';
import { RequireOnlyOne } from '../../types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { validateNumber } from '../../validate/index.js';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleAssetType,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBeneficiary,
	XcmV2Junctions,
	XcmV3Junctions,
	XcmV4Junctions,
} from '../types.js';
import { createAssets } from '../util/createAssets.js';
import { createInteriorValueDest } from '../util/createDest.js';
import { createFeeAssetItem } from '../util/createFeeAssetItem.js';
import { createMultiAsset } from '../util/createMultiAsset.js';
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
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest(destId: string, xcmVersion: number): XcmDestBeneficiary {
		return createInteriorValueDest({
			destId,
			parents: 2,
			xcmVersion,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assets The assets to create into xcm `MultiAssets`.
	 * @param opts Options regarding the registry, and types of asset transfers.
	 */
	async createAssets(
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> {
		return createAssets({
			amounts,
			xcmVersion,
			specName,
			assets,
			opts,
			multiAssetCreator: createSystemToBridgeAssets,
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
 * @param xcmVersion The accepted xcm version.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
export const createSystemToBridgeAssets = async ({
	api,
	amounts,
	specName,
	assets,
	registry,
	xcmVersion,
	isForeignAssetsTransfer,
	isLiquidTokenTransfer,
}: {
	api: ApiPromise;
	amounts: string[];
	specName: string;
	assets: string[];
	xcmVersion: number;
	registry: Registry;
	destChainId?: string;
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
}): Promise<FungibleAssetType[]> => {
	let multiAssets: FungibleAssetType[] = [];

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const palletId = fetchPalletInstanceId(api, assetId, isLiquidTokenTransfer, isForeignAssetsTransfer);

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(registry, assetId);
		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, isForeignAssetsTransfer);
		}

		let multiLocation: UnionXcmMultiLocation;

		if (isForeignAssetsTransfer) {
			multiLocation = resolveMultiLocation(assetId, xcmVersion);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: RequireOnlyOne<XcmV4Junctions | XcmV3Junctions | XcmV2Junctions> = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
					};

			multiLocation = {
				parents,
				interior,
			};
		}

		const multiAsset = createMultiAsset({
			amount,
			multiLocation,
			xcmVersion,
		});
		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets);

	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};
