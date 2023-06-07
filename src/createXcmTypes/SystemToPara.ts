// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	MultiAssetsV2,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { findRelayChain, parseRegistry } from '../registry';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { MultiAsset, MultiAssetInterior } from './../types';
import { ICreateXcmType, IWeightLimit } from './types';
import { isAscendingOrder } from './util/checkIsAscendingOrder';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getSystemChainTokenSymbolGeneralIndex } from './util/getTokenSymbolGeneralIndex';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const SystemToPara: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param api ApiPromise
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (
		api: ApiPromise,
		accountId: string,
		xcmVersion?: number
	): VersionedMultiLocation => {
		if (xcmVersion == 2) {
			const X1 = isEthereumAddress(accountId)
				? { AccountKey20: { network: 'Any', key: accountId } }
				: { AccountId32: { network: 'Any', id: accountId } };

			return api.registry.createType('XcmVersionedMultiLocation', {
				V2: {
					parents: 0,
					interior: {
						X1,
					},
				},
			});
		}

		const X1 = isEthereumAddress(accountId)
			? { AccountKey20: { key: accountId } }
			: { AccountId32: { id: accountId } };

		return api.registry.createType('XcmVersionedMultiLocation', {
			V3: {
				parents: 0,
				interior: {
					X1,
				},
			},
		});
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param api ApiPromise
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (
		api: ApiPromise,
		destId: string,
		xcmVersion?: number
	): VersionedMultiLocation => {
		if (xcmVersion === 2) {
			return api.registry.createType('XcmVersionedMultiLocation', {
				V2: {
					parents: 1,
					interior: {
						X1: {
							parachain: destId,
						},
					},
				},
			});
		}

		/**
		 * Ensure that the `parents` field is a `1` when sending a destination MultiLocation
		 * from a system parachain to a sovereign parachain.
		 */
		return api.registry.createType('XcmVersionedMultiLocation', {
			V3: {
				parents: 1,
				interior: {
					X1: {
						parachain: destId,
					},
				},
			},
		});
	},
	/**
	 * Create a VersionedMultiAsset type.
	 *
	 * @param assets
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[]
	): VersionedMultiAssets => {
		const sortedAndDedupedMultiAssets = createSystemToParaMultiAssets(
			api,
			amounts,
			specName,
			assets
		);

		if (xcmVersion === 2) {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV2MultiassetMultiAssets',
				sortedAndDedupedMultiAssets
			);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V2: multiAssetsType,
			});
		} else {
			const multiAssetsType: XcmV3MultiassetMultiAssets =
				api.registry.createType(
					'XcmV3MultiassetMultiAssets',
					sortedAndDedupedMultiAssets
				);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V3: multiAssetsType,
			});
		}
	},
	/**
	 * TODO: Generalize the weight type with V3.
	 * Create a WeightLimitV2 type.
	 *
	 * @param api ApiPromise
	 * @param weightLimit WeightLimit passed in as an option.
	 */
	createWeightLimit: (api: ApiPromise, weightLimit?: string): WeightLimitV2 => {
		const limit: IWeightLimit = weightLimit
			? { Limited: weightLimit }
			: { Unlimited: null };

		return api.registry.createType('XcmV2WeightLimit', limit);
	},

	/**
	 * returns the correct feeAssetItem based on XCM direction.
	 *
	 * @param api ApiPromise
	 * @param paysWithFeeDest string
	 * @param specName string
	 * @param assetIds string[]
	 * @param amounts string[]
	 * @xcmVersion number
	 *
	 */
	createFeeAssetItem: (
		api: ApiPromise,
		paysWithFeeDest?: string,
		specName?: string,
		assetIds?: string[],
		amounts?: string[],
		xcmVersion?: number
	): u32 => {
		if (
			xcmVersion &&
			xcmVersion === 3 &&
			specName &&
			amounts &&
			assetIds &&
			paysWithFeeDest
		) {
			const multiAssets = createSystemToParaMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds
			);

			const assetIndex = getFeeAssetItemIndex(
				paysWithFeeDest,
				multiAssets,
				specName
			);
			const feeAssetItem = api.registry.createType('u32', assetIndex);

			return feeAssetItem;
		}

		return api.registry.createType('u32', 0);
	},
};

/**
 * Creates and returns a MultiAsset array for system parachains based on provided specName, assets and amounts
 *
 * @param api ApiPromise[]
 * @param amounts string[]
 * @param specName string
 * @param assets string[]
 */
export const createSystemToParaMultiAssets = (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[]
): MultiAsset[] => {
	const palletId = fetchPalletInstanceId(api);
	const multiAssets = [];
	const registry = parseRegistry({});
	const relayChain = findRelayChain(specName, registry);

	// We know this is a System parachain direction which is chainId 1000.
	const { tokens } = registry[relayChain]['1000'];

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative && isNotANumber) {
			assetId = getSystemChainTokenSymbolGeneralIndex(assetId, specName);
		}

		const interior: MultiAssetInterior = isRelayNative
			? { Here: '' }
			: { X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }] };
		const parents = isRelayNative ? 1 : 0;

		const multiAsset = {
			id: {
				Concrete: {
					parents,
					interior,
				},
			},
			fun: {
				Fungible: amount,
			},
		};

		multiAssets.push(multiAsset);
	}

	if (!isAscendingOrder(multiAssets)) {
		sortMultiAssetsAscending(multiAssets);
	}

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};

const isRelayNativeAsset = (tokens: string[], assetId: string): boolean => {
	for (const token of tokens) {
		if (token.toLowerCase() === assetId.toLowerCase()) {
			return true;
		}
	}

	return false;
};
