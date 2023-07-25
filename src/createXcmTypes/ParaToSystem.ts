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
import { MultiAsset, MultiAssetInterior, XCMDestBenificiary, XcmMultiAsset } from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
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
	 * @param isLimited Whether the tx is limited
	 * @param refTime amount of computation time
	 * @param proofSize amount of storage to be used
	 */
	createWeightLimit: (
		api: ApiPromise, 
		isLimited?: boolean, 
		refTime?: string,
		proofSize?: string
		): WeightLimitV2 => {
			const limit: IWeightLimit = isLimited && refTime && proofSize
			? { 
				Limited: { refTime, proofSize } 
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
								X1: { AccountId32: { id: accountId }
							}
						}
					}
				} 
			}

			return {
				V3: {
					parents: 0,
					interior: {
						X1: { AccountId32: { id: accountId }
					}
				}
			}
		} 
	},
	createXTokensAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): XcmMultiAsset[] => {
		return createXTokensMultiAssets(
			api,
			amounts,
			xcmVersion,
			specName,
			assets,
			opts
		);
	},

	createXTokensFeeAssetItem: (api: ApiPromise, opts: CreateFeeAssetItemOpts): XcmMultiAsset => {
			const {
				paysWithFeeDest,
				specName,
				assetIds,
				amounts,
				xcmVersion,
			} = opts;

			if (
				xcmVersion &&
				specName &&
				amounts &&
				assetIds &&
				paysWithFeeDest
			) {

				const multiAssets = createXTokensMultiAssets(
					api,
					amounts,
					xcmVersion,
					specName,
					assetIds,
					opts,
				);

				return multiAssets[0];
			}

		return {} as XcmMultiAsset;
	}
}

const createXTokensMultiAssets = (
	api: ApiPromise,
	amounts: string[],
	xcmVersion: number,
	specName: string,
	assets: string[],
	opts: CreateAssetsOpts,
): XcmMultiAsset[] => {
	const assetHubChainId = 1000;
	const { assetsPalletInstance } = opts.registry.currentRelayRegistry[assetHubChainId];
	const palletId = assetsPalletInstance as string;
	const { tokens: relayTokens } = opts.registry.currentRelayRegistry['0'];
	const { assetsInfo: assetHubTokens } = opts.registry.currentRelayRegistry[assetHubChainId];
	
	const multiAssets: XcmMultiAsset[] = [];
	for (let i = 0; i < assets.length; i++) {
		let multiAsset: XcmMultiAsset;
		const amount = amounts[i];
		let assetId = assets[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(relayTokens, assetId);
		const  isAssetHubNative = assetHubTokens[assetId] ? true: false;

		if (!isRelayNative && isNotANumber) {
			assetId = getSystemChainTokenSymbolGeneralIndex(assetId, specName);
		}
	
		const interior: InteriorMultiLocation = isHex(assetId)
			? api.registry.createType('InteriorMultiLocation', { X1: { GeneralKey: assetId } })
			: isRelayNative
			? api.registry.createType('InteriorMultiLocation', { Here: '' })
			: api.registry.createType('InteriorMultiLocation', { X3: [{Parachain: assetHubChainId}, { PalletInstance: palletId }, { GeneralIndex: assetId }] });
		const parents = isRelayNative || isAssetHubNative ? 1 : 0;
		
		if (xcmVersion === 2) {
			 multiAsset = {
				V2: {
						id: {
						Concrete: {
							parents,
							interior,
						},
					},
					fun: {
						Fungible: { Fungible: amount },
					},
				}
			}
		} else {
			multiAsset = {
				V3: {
						id: {
						Concrete: {
							parents,
							interior,
						},
					},
					fun: {
						Fungible: { Fungible: amount },
					},
				}
			}
		}

		multiAssets.push(multiAsset);
	}

	return multiAssets;
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
