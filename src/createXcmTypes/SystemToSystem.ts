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

import { ASSET_HUB_CHAIN_ID } from '../consts';
import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import { BaseError, BaseErrorsEnum } from '../errors';
import type { Registry } from '../registry';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { MultiAsset } from './../types';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	ICreateXcmType,
	IWeightLimit,
} from './types';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getAssetHubAssetId } from './util/getAssetHubAssetId';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { isSystemChain } from './util/isSystemChain';
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
		const { registry, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;

		const sortedAndDedupedMultiAssets = await createSystemToSystemMultiAssets(
			api,
			amounts,
			specName,
			assets,
			registry,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer
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
	 * Create an XcmV3WeightLimit type.
	 *
	 * @param api ApiPromise
	 * @param isLimited Whether the tx is limited
	 * @param refTime amount of computation time
	 * @param proofSize amount of storage to be used
	 */
	createWeightLimit: (
		api: ApiPromise,
		opts: CreateWeightLimitOpts
	): WeightLimitV2 => {
		const limit: IWeightLimit =
			opts.isLimited && opts.weightLimit?.refTime && opts.weightLimit?.proofSize
				? {
						Limited: {
							refTime: opts.weightLimit?.refTime,
							proofSize: opts.weightLimit?.proofSize,
						},
				  }
				: { Unlimited: null };

		return api.registry.createType('XcmV3WeightLimit', limit);
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
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
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
				isForeignAssetsTransfer,
				isLiquidTokenTransfer
			);

			const systemChainId = getChainIdBySpecName(registry, specName);

			if (!isSystemChain(systemChainId)) {
				throw new BaseError(
					`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
					BaseErrorsEnum.InternalError
				);
			}

			const assetIndex = getFeeAssetItemIndex(
				api,
				registry,
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
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean
): Promise<MultiAsset[]> => {
	let multiAssets: MultiAsset[] = [];

	const { foreignAssetsPalletInstance } =
		registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];
	const foreignAssetsPalletId = foreignAssetsPalletInstance as string;
	const systemChainId = getChainIdBySpecName(registry, specName);

	if (!isSystemChain(systemChainId)) {
		throw new BaseError(
			`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
			BaseErrorsEnum.InternalError
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
				assetId = await getAssetHubAssetId(
					api,
					registry,
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
			const palletInstanceJunctionStr = `{"PalletInstance":"${foreignAssetsPalletId}"},`;
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
							{
								PalletInstance: fetchPalletInstanceId(
									api,
									isLiquidTokenTransfer
								),
							},
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

	multiAssets = sortMultiAssetsAscending(multiAssets) as MultiAsset[];

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(
		multiAssets
	) as MultiAsset[];

	return sortedAndDedupedMultiAssets;
};
