// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import { DEFAULT_XCM_VERSION } from '../consts.js';
import { BaseError, BaseErrorsEnum } from '../errors/index.js';
import { Registry } from '../registry/index.js';
import { XCMAssetRegistryMultiLocation } from '../registry/types.js';
import { Direction } from '../types.js';
import { resolveMultiLocation } from '../util/resolveMultiLocation.js';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	FungibleObjAsset,
	FungibleObjAssetType,
	FungibleObjMultiAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	UnionXcAssetsMultiAsset,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiLocation,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBeneficiary,
	XcmV2MultiLocation,
	XcmV3MultiLocation,
	XcmV4MultiLocation,
} from './types.js';
import { createAssets } from './util/createAssets.js';
import { createBeneficiary, createXTokensParachainDestBeneficiary } from './util/createBeneficiary.js';
import { createParachainDest } from './util/createDest.js';
import { createFeeAssetItem } from './util/createFeeAssetItem.js';
import { createWeightLimit } from './util/createWeightLimit.js';
import { dedupeAssets } from './util/dedupeAssets.js';
import { getParachainNativeAssetLocation } from './util/getParachainNativeAssetLocation.js';
import { getXcAssetMultiLocationByAssetId } from './util/getXcAssetMultiLocationByAssetId.js';
import { isParachainPrimaryNativeAsset } from './util/isParachainPrimaryNativeAsset.js';
import { sortAssetsAscending } from './util/sortAssetsAscending.js';

export const ParaToPara: ICreateXcmType = {
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
		return await createAssets({
			amounts,
			xcmVersion,
			specName,
			assets,
			opts,
			multiAssetCreator: createParaToParaMultiAssets,
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
		return await createFeeAssetItem({
			api,
			opts,
			multiAssetCreator: createParaToParaMultiAssets,
		});
	},
	/**
	 * Create xTokens beneficiary structured type.
	 *
	 * @param destChainId The parachain Id of the destination.
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createXTokensBeneficiary: createXTokensParachainDestBeneficiary,
	/**
	 * Create multiple xTokens Assets.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assets The assets to create into xcm `MultiAssets`.
	 * @param opts Options used to create xTokens `MultiAssets`.
	 */
	createXTokensAssets: async (
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<UnionXcAssetsMultiAssets> => {
		return await createXTokensMultiAssets(amounts, xcmVersion, specName, assets, opts);
	},
	/**
	 * Create a single xToken asset.
	 *
	 * @param amount Amount per asset. This will be of length 1.
	 * @param xcmVersion The accepted xcm version.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assetId Single asset to be created into a `MultiAsset`.
	 * @param opts Options to create a single Asset.
	 */
	createXTokensAsset: async (
		amount: string,
		xcmVersion: number,
		specName: string,
		assetId: string,
		opts: CreateAssetsOpts,
	): Promise<UnionXcAssetsMultiAsset> => {
		const { registry, api } = opts;
		let multiAsset: FungibleObjAssetType | undefined;
		let concreteMultiLocation: UnionXcmMultiLocation;

		// check if asset is the parachains primary native asset
		const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
			registry,
			specName,
			Direction.ParaToPara,
			assetId,
		);

		if (isPrimaryParachainNativeAsset) {
			const multiLocation =
				xcmVersion < 4 ? { parents: 0, interior: { Here: '' } } : { parents: 0, interior: { X1: [{ Here: '' }] } };

			concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);

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
		} else {
			const xcAssetMultiLocationStr = await getXcAssetMultiLocationByAssetId(
				api,
				assetId,
				specName,
				xcmVersion,
				registry,
			);
			const parsedMultiLocation = JSON.parse(xcAssetMultiLocationStr) as XCMAssetRegistryMultiLocation;
			const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

			concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);

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
		}

		if (xcmVersion === 2) {
			return { V2: multiAsset as FungibleObjMultiAsset };
		} else if (xcmVersion === 3) {
			return { V3: multiAsset as FungibleObjMultiAsset };
		} else {
			return { V4: multiAsset as FungibleObjAsset };
		}
	},
	/**
	 * Create an xTokens xcm `feeAssetItem`.
	 *
	 * @param opts Options used for creating `feeAssetItem`.
	 */
	createXTokensFeeAssetItem: (opts: CreateFeeAssetItemOpts): UnionXcAssetsMultiLocation => {
		const { paysWithFeeDest, xcmVersion } = opts;

		if (xcmVersion && paysWithFeeDest) {
			const paysWithFeeMultiLocation = resolveMultiLocation(paysWithFeeDest, xcmVersion);

			if (xcmVersion === 2) {
				return {
					V2: {
						id: {
							Concrete: paysWithFeeMultiLocation as XcmV2MultiLocation,
						},
					},
				};
			}

			if (xcmVersion === 3) {
				return {
					V3: {
						id: {
							Concrete: paysWithFeeMultiLocation as XcmV3MultiLocation,
						},
					},
				};
			}

			return {
				V4: {
					id: paysWithFeeMultiLocation as XcmV4MultiLocation,
				},
			};
		}

		throw new BaseError('failed to create xTokens fee multilocation', BaseErrorsEnum.InternalError);
	},
};

/**
 * Create `xTokens` MultiAssets.
 *
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param xcmVersion The accepted xcm version.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param opts Options used to create xTokens `MultiAssets`.
 */
const createXTokensMultiAssets = async (
	amounts: string[],
	xcmVersion: number,
	specName: string,
	assets: string[],
	opts: CreateAssetsOpts,
): Promise<UnionXcAssetsMultiAssets> => {
	const { registry, api } = opts;
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

/**
 * Create multiassets for ParaToPara direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param xcmVersion The accepted xcm version.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
const createParaToParaMultiAssets = async ({
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
}): Promise<FungibleStrAssetType[]> => {
	let multiAssets: FungibleStrAssetType[] = [];
	let multiAsset: FungibleStrAssetType | undefined = undefined;
	let concreteMultiLocation;
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToPara,
		assets[0],
	);

	if (isPrimaryParachainNativeAsset) {
		concreteMultiLocation = resolveMultiLocation(
			getParachainNativeAssetLocation(registry, assets[0], destChainId),
			xcmVersion,
		);

		if (xcmVersion < 4) {
			multiAsset = {
				id: {
					Concrete: concreteMultiLocation,
				},
				fun: {
					Fungible: amounts[0],
				},
			};
		} else {
			multiAsset = {
				id: concreteMultiLocation,
				fun: {
					Fungible: amounts[0],
				},
			};
		}

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

			concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);

			if (xcmVersion < 4) {
				multiAsset = {
					id: {
						Concrete: concreteMultiLocation,
					},
					fun: {
						Fungible: amount,
					},
				};
			} else {
				multiAsset = {
					id: concreteMultiLocation,
					fun: {
						Fungible: amount,
					},
				};
			}

			multiAssets.push(multiAsset);
		}
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleStrAssetType[];

	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleStrMultiAsset[];

	return sortedAndDedupedMultiAssets;
};
