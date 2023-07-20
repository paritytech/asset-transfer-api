// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types';
import type {
	InteriorMultiLocation,
	MultiAssetsV2,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';
import { isHex } from '@polkadot/util';

import type { Registry } from '../registry';
import { MultiAsset, MultiAssetInterior, XCMDestBenificiary, XcmMultiAsset, XcmWeight } from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { getFeeAssetItemIndexForXTokens } from '../util/getFeeAssetItemIndexForXTokens';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	ICreateXcmType,
	IWeightLimit,
} from './types';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { getSystemChainTokenSymbolGeneralIndex } from './util/getTokenSymbolGeneralIndex';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const ParaToSystem: ICreateXcmType = {
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
		xcmVersion?: number,
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
	createDest: (api: ApiPromise, destId: string, xcmVersion?: number) => {
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
		assets: string[],
		opts: CreateAssetsOpts
	): VersionedMultiAssets => {
		const sortedAndDedupedMultiAssets = createParaToSystemMultiAssets(
			amounts,
			specName,
			assets,
			opts.registry
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
	createFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts): u32 => {
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
			const multiAssets = createParaToSystemMultiAssets(
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				registry
			);

			const assetIndex = getFeeAssetItemIndex(
				paysWithFeeDest,
				multiAssets,
				specName
			);

			return api.registry.createType('u32', assetIndex);
		}

		return api.registry.createType('u32', 0);
	},
	createXTokensBeneficiary: (
		accountId: string,
		xcmVersion: number,
		): XCMDestBenificiary => {
				if (xcmVersion === 2) {
					return {
						V2: {
							parents: 0,
							interior: {
								X1: { AccountId32: { network: 'Any', id: accountId }
							}
						}
					}
				} 
			}

			return {
				V3: {
					parents: 0,
					interior: {
						X1: { AccountId32: { network: 'Any', id: accountId }
					}
				}
			}
		} 
	},
	createXTokensAsset: (
		api: ApiPromise,
		amount: string,
		xcmVersion: number,
		specName: string,
		asset: string,
		opts: CreateAssetsOpts,
	): XcmMultiAsset => {
		
	},
	createXTokensWeightLimit: (
		weightLimit?: string
	): XcmWeight =>  {
		const limit = weightLimit
		? { Limited: weightLimit }
		: { Unlimited: null };

		return limit;
	},
	createXTokensFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts): XcmMultiAsset => {
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
			const multiAssets: XcmMultiAsset[] = [];

			const multiAsset = createXTokensMultiAsset(
				api,
				amounts[0],
				xcmVersion,
				specName,
				assetIds[0],
				opts,
			);

			multiAssets.push(multiAsset);
	
			const assetIndex = getFeeAssetItemIndexForXTokens(
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmVersion
			);

		}
	}
};

const createXTokensMultiAsset = (
	api: ApiPromise,
	amount: string,
	xcmVersion: number,
	specName: string,
	asset: string,
	opts: CreateAssetsOpts,
): XcmMultiAsset => {
	let assetId = asset;
	const { assetsPalletInstance } = opts.registry.currentRelayRegistry['1000'];
	const palletId = assetsPalletInstance as string;
	const { tokens } = opts.registry.currentRelayRegistry['0'];

	const parsedAssetIdAsNumber = Number.parseInt(assetId);
	const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
	const isRelayNative = isRelayNativeAsset(tokens, assetId);

	if (!isRelayNative && isNotANumber) {
		assetId = getSystemChainTokenSymbolGeneralIndex(asset, specName);
	}

	const interior: InteriorMultiLocation = isHex(assetId)
		? api.registry.createType('InteriorMultiLocation', { X2: [{ GeneralKey: assetId }] })
		: isRelayNative
		? api.registry.createType('InteriorMultiLocation', { Here: '' })
		: api.registry.createType('InteriorMultiLocation', { X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }] });
	const parents = isRelayNative ? 1 : 0;

	if (xcmVersion === 2) {
		return {
			V2: {
					id: {
					Concrete: {
						parents,
						interior,
					},
				},
				fun: {
					Fungible: { Fungible: parseInt(amount)},
				},
			}
		};
	}

	return {
		V3: {
				id: {
				Concrete: {
					parents,
					interior,
				},
			},
			fun: {
				Fungible: { Fungible: parseInt(amount)},
			},
		}
	}
}

/**
 * Create multiassets for ParaToSystem direction.
 *
 * @param api
 * @param amounts
 * @param specName
 * @param assets
 * @param registry
 */
const createParaToSystemMultiAssets = (
	amounts: string[],
	specName: string,
	assets: string[],
	registry: Registry
): MultiAsset[] => {
	// This will always result in a value and will never be null because the assets-hub will always
	// have the assets pallet present, so we type cast here to work around the type compiler.
	const { assetsPalletInstance } = registry.currentRelayRegistry['1000'];
	const palletId = assetsPalletInstance as string;
	let multiAssets = [];

	const { tokens } = registry.currentRelayRegistry['0'];

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		let assetId = assets[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative && isNotANumber) {
			assetId = getSystemChainTokenSymbolGeneralIndex(assetId, specName);
		}

		const interior: MultiAssetInterior = isHex(assetId)
			? { X2: [{ GeneralKey: assetId }] }
			: isRelayNative
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

	multiAssets = sortMultiAssetsAscending(multiAssets);

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};
