// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	InteriorMultiLocation,
	MultiAssetsV2,
	MultiLocation,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';

import { SYSTEM_PARACHAINS_IDS } from '../consts';
import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import { BaseError } from '../errors';
import type { Registry } from '../registry';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { MultiAsset } from './../types';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	ICreateXcmType,
	IWeightLimit,
} from './types';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getChainAssetId } from './util/getChainAssetId';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const SystemToSystem: ICreateXcmType = {
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
			return api.registry.createType('XcmVersionedMultiLocation', {
				V2: {
					parents: 0,
					interior: {
						X1: { AccountId32: { network: 'Any', id: accountId } },
					},
				},
			});
		}

		return api.registry.createType('XcmVersionedMultiLocation', {
			V3: {
				parents: 0,
				interior: {
					X1: { AccountId32: { id: accountId } },
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
	createAssets: async (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	): Promise<VersionedMultiAssets> => {
		const { registry } = opts;

		const sortedAndDedupedMultiAssets = await createSystemToSystemMultiAssets(
			api,
			amounts,
			specName,
			assets,
			registry,
			opts.isForeignAssetsTransfer
		);

		if (xcmVersion === 2) {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV2MultiassetMultiAssets',
				sortedAndDedupedMultiAssets
			);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V2: multiAssetsType,
				})
			);
		} else {
			const multiAssetsType: XcmV3MultiassetMultiAssets =
				api.registry.createType(
					'XcmV3MultiassetMultiAssets',
					sortedAndDedupedMultiAssets
				);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V3: multiAssetsType,
				})
			);
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
	createFeeAssetItem: async (
		api: ApiPromise,
		opts: CreateFeeAssetItemOpts
	): Promise<u32> => {
		const {
			registry,
			paysWithFeeDest,
			specName,
			assetIds,
			amounts,
			xcmVersion,
		} = opts;
		if (
			xcmVersion &&
			xcmVersion === 3 &&
			specName &&
			amounts &&
			assetIds &&
			paysWithFeeDest
		) {
			const multiAssets = await createSystemToSystemMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				registry,
				opts.isForeignAssetsTransfer
			);

			const systemChainId = getChainIdBySpecName(registry, specName);

			if (!SYSTEM_PARACHAINS_IDS.includes(systemChainId)) {
				throw new BaseError(
					`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`
				);
			}

			const assetIndex = getFeeAssetItemIndex(
				api,
				paysWithFeeDest,
				multiAssets,
				specName,
				opts.isForeignAssetsTransfer
			);

			return api.registry.createType('u32', assetIndex);
		}

		return api.registry.createType('u32', 0);
	},
};

/**
 * Creates and returns a MultiAsset array for system parachains based on provided specName, chain ID, assets and amounts
 *
 * @param api ApiPromise[]
 * @param amounts string[]
 * @param specName string
 * @param assets string[]
 * @param chainId string
 */
export const createSystemToSystemMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	registry: Registry,
	isForeignAssetsTransfer?: boolean
): Promise<MultiAsset[]> => {
	let multiAssets = [];
	const foreignAssetPalletInstance = '53';
	const systemChainId = getChainIdBySpecName(registry, specName);

	if (!SYSTEM_PARACHAINS_IDS.includes(systemChainId)) {
		throw new BaseError(
			`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`
		);
	}

	const { tokens } = registry.currentRelayRegistry[systemChainId];

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative) {
			if (isNotANumber) {
				assetId = await getChainAssetId(
					api,
					assetId,
					specName,
					isForeignAssetsTransfer
				);
			}
		}

		let concretMultiLocation: MultiLocation;

		if (isForeignAssetsTransfer) {
			const assetIdMultiLocation = api.registry.createType(
				'MultiLocation',
				JSON.parse(assetId)
			);

			// start of the junctions values of the assetId. + 1 to ignore the '['
			const junctionsStartIndex = assetId.indexOf('[') + 1;
			// end index of the junctions values of the assetId
			const junctionsEndIndex = assetId.indexOf(']');
			// e.g. {"Parachain": "2125"}, {"GeneralIndex": "0"}
			const junctions = assetId.slice(
				junctionsStartIndex + 1,
				junctionsEndIndex
			);
			// number of junctions found in the assetId. used to determine the number of junctions
			// after adding the PalletInstance (e.g. 2 junctions becomes X3)
			const junctionCount = junctions.split('},').length + 1;

			const numberOfJunctions = `"X${junctionCount}"`;
			const palletInstanceJunctionStr = `{"PalletInstance":"${foreignAssetPalletInstance}"},`;
			const interiorMultiLocationStr = `{${numberOfJunctions}:[${palletInstanceJunctionStr}${junctions}]}`;

			concretMultiLocation = api.registry.createType('MultiLocation', {
				parents: assetIdMultiLocation.parents,
				interior: api.registry.createType(
					'InteriorMultiLocation',
					JSON.parse(interiorMultiLocationStr)
				),
			});
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: InteriorMultiLocation = isRelayNative
				? api.registry.createType('InteriorMultiLocation', { Here: '' })
				: api.registry.createType('InteriorMultiLocation', {
						X2: [
							{ PalletInstance: fetchPalletInstanceId(api) },
							{ GeneralIndex: assetId },
						],
				  });
			concretMultiLocation = api.registry.createType('MultiLocation', {
				parents,
				interior,
			});
		}

		const multiAsset = {
			id: {
				Concrete: concretMultiLocation,
			},
			fun: {
				Fungible: amount,
			},
		};

		multiAssets.push(multiAsset);
	}

	multiAssets = sortMultiAssetsAscending(multiAssets);

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};
