// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { Registry } from '../registry';
import { XCMAssetRegistryMultiLocation } from '../registry/types';
import { Direction } from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
	XcmWeight,
} from './types';
import { dedupeAssets } from './util/dedupeAssets';
import { getParachainNativeAssetLocation } from './util/getParachainNativeAssetLocation';
import { getXcAssetMultiLocationByAssetId } from './util/getXcAssetMultiLocationByAssetId';
import { isParachainPrimaryNativeAsset } from './util/isParachainPrimaryNativeAsset';
import { sortAssetsAscending } from './util/sortAssetsAscending';

export const ParaToEthereum: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmDestBeneficiary => {
		if (xcmVersion === 2) {
			const X1 = isEthereumAddress(accountId)
				? { AccountKey20: { network: 'Any', key: accountId } }
				: { AccountId32: { network: 'Any', id: accountId } };

			return {
				V2: {
					parents: 0,
					interior: {
						X1,
					},
				},
			};
		}

		if (xcmVersion === 3) {
			const X1 = isEthereumAddress(accountId)
				? { AccountKey20: { key: accountId } }
				: { AccountId32: { id: accountId } };

			return {
				V3: {
					parents: 0,
					interior: {
						X1,
					},
				},
			};
		}

		const X1 = isEthereumAddress(accountId)
			? [{ AccountKey20: { key: accountId } }]
			: [{ AccountId32: { id: accountId } }];

		return {
			V4: {
				parents: 0,
				interior: {
					X1,
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param destId The parachain Id of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (destId: string, xcmVersion?: number): XcmDestBeneficiary => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 1,
					interior: {
						X1: {
							Parachain: destId,
						},
					},
				},
			};
		}

		if (xcmVersion === 3) {
			/**
			 * Ensure that the `parents` field is a `1` when sending a destination MultiLocation
			 * from a system parachain to a sovereign parachain.
			 */
			return {
				V3: {
					parents: 1,
					interior: {
						X1: {
							Parachain: destId,
						},
					},
				},
			};
		}

		return {
			V4: {
				parents: 1,
				interior: {
					X1: [{ Parachain: destId }],
				},
			},
		};
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
		const { registry, destChainId } = opts;

		const sortedAndDedupedMultiAssets = await createParaToEthereumMultiAssets(
			opts.api,
			amounts,
			specName,
			assets,
			xcmVersion,
			registry,
			destChainId,
		);

		if (xcmVersion === 2) {
			return Promise.resolve({
				V2: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[],
			});
		} else if (xcmVersion === 3) {
			return Promise.resolve({
				V3: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[],
			});
		} else {
			return Promise.resolve({
				V4: sortedAndDedupedMultiAssets as FungibleStrAsset[],
			});
		}
	},
	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit: (opts: CreateWeightLimitOpts): XcmWeight => {
		return opts.weightLimit?.refTime && opts.weightLimit?.proofSize
			? {
					Limited: {
						refTime: opts.weightLimit.refTime,
						proofSize: opts.weightLimit.proofSize,
					},
				}
			: { Unlimited: null };
	},
	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 * @param opts Options that are used for fee asset construction.
	 */
	createFeeAssetItem: async (api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<number> => {
		const { registry, paysWithFeeDest, specName, assetIds, amounts, xcmVersion, isForeignAssetsTransfer } = opts;
		if (xcmVersion && xcmVersion >= 3 && specName && amounts && assetIds && paysWithFeeDest) {
			const multiAssets = await createParaToEthereumMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				xcmVersion,
				registry,
			);

			const assetIndex = getFeeAssetItemIndex(
				api,
				registry,
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmVersion,
				isForeignAssetsTransfer,
			);

			return assetIndex;
		}

		return 0;
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
const createParaToEthereumMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	xcmVersion: number,
	registry: Registry,
	destChainId?: string,
): Promise<FungibleStrAssetType[]> => {
	let multiAssets: FungibleStrAssetType[] = [];
	let multiAsset: FungibleStrAssetType | undefined = undefined;
	let concreteMultiLocation;
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToEthereum,
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
