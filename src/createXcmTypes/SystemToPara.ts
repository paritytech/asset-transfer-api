// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../consts.js';
import { BaseError, BaseErrorsEnum } from '../errors/index.js';
import type { Registry } from '../registry/index.js';
import type { RequireOnlyOne } from '../types.js';
import { resolveMultiLocation } from '../util/resolveMultiLocation.js';
import { validateNumber } from '../validate/index.js';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleStrAssetType,
	ICreateXcmType,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBeneficiary,
	XcmV2Junctions,
	XcmV3Junctions,
	XcmV4Junctions,
} from './types.js';
import { assetIdIsLocation } from './util/assetIdIsLocation.js';
import { createAssets } from './util/createAssets.js';
import { createBeneficiary } from './util/createBeneficiary.js';
import { createParachainDest } from './util/createDest.js';
import { createFeeAssetItem } from './util/createFeeAssetItem.js';
import { createStrTypeMultiAsset } from './util/createMultiAsset.js';
import { createWeightLimit } from './util/createWeightLimit.js';
import { dedupeAssets } from './util/dedupeAssets.js';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId.js';
import { getAssetId } from './util/getAssetId.js';
import { isRelayNativeAsset } from './util/isRelayNativeAsset.js';
import { isSystemChain } from './util/isSystemChain.js';
import { sortAssetsAscending } from './util/sortAssetsAscending.js';

export const SystemToPara: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary,
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
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
			multiAssetCreator: createSystemToParaMultiAssets,
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
			multiAssetCreator: createSystemToParaMultiAssets,
			verifySystemChain: true,
		});
	},
};

/**
 * Create multiassets for SystemToPara direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param xcmVersion The accepted xcm version.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 * @param isLiquidTokenTransfer Whether this transfer is a liquid pool assets transfer.
 */
export const createSystemToParaMultiAssets = async ({
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
}): Promise<FungibleStrAssetType[]> => {
	let multiAssets: FungibleStrAssetType[] = [];
	const systemChainId = registry.lookupChainIdBySpecName(specName);

	if (!isSystemChain(systemChainId)) {
		throw new BaseError(
			`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
			BaseErrorsEnum.InternalError,
		);
	}

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

		if (isForeignAssetsTransfer && assetIdIsLocation(assetId)) {
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

		const multiAsset = createStrTypeMultiAsset({
			amount,
			multiLocation,
			xcmVersion,
		});
		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleStrAssetType[];

	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleStrAssetType[];

	return sortedAndDedupedMultiAssets;
};
