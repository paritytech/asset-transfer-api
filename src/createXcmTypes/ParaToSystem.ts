// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types';
import type {
	InteriorMultiLocation,
	MultiAssetsV2,
	MultiLocation,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';
import { isHex } from '@polkadot/util';

import { BaseError } from '../errors';
import type { Registry } from '../registry';
import {
	MultiAsset,
	XCMDestBenificiary,
	XcmMultiAsset,
	XcmMultiLocation,
} from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	ICreateXcmType,
	IWeightLimit,
} from './types';
import { constructForeignAssetMultiLocationFromAssetId } from './util/constructForeignAssetMultiLocationFromAssetId';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { getChainAssetId } from './util/getChainAssetId';
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
	createAssets: async (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	): Promise<VersionedMultiAssets> => {
		const sortedAndDedupedMultiAssets = await createParaToSystemMultiAssets(
			api,
			amounts,
			specName,
			assets,
			opts.registry,
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
			opts.isLimited && opts.refTime && opts.proofSize
				? {
						Limited: { refTime: opts.refTime, proofSize: opts.proofSize },
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
		} = opts;
		if (
			xcmVersion &&
			xcmVersion === 3 &&
			specName &&
			amounts &&
			assetIds &&
			paysWithFeeDest
		) {
			const multiAssets = await createParaToSystemMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				registry,
				opts.isForeignAssetsTransfer
			);

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
	createXTokensBeneficiary: (
		destChainId: string,
		accountId: string,
		xcmVersion: number
	): XCMDestBenificiary => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 1,
					interior: {
						X2: [
							{ Parachain: destChainId },
							{ AccountId32: { id: accountId } },
						],
					},
				},
			};
		}

		return {
			V3: {
				parents: 1,
				interior: {
					X2: [{ Parachain: destChainId }, { AccountId32: { id: accountId } }],
				},
			},
		};
	},
	createXTokensAssets: async (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	): Promise<VersionedMultiAssets> => {
		return await createXTokensMultiAssets(
			api,
			amounts,
			xcmVersion,
			specName,
			assets,
			opts
		);
	},
	createXTokensAsset: async (
		api: ApiPromise,
		amount: string,
		xcmVersion: number,
		specName: string,
		assetId: string,
		opts: CreateAssetsOpts
	): Promise<XcmMultiAsset> => {
		const assetHubChainId = 1000;
		const { assetsPalletInstance } =
			opts.registry.currentRelayRegistry[assetHubChainId];
		const palletId = assetsPalletInstance as string;
		const { tokens: relayTokens } = opts.registry.currentRelayRegistry['0'];
		const { assetsInfo: assetHubTokens } =
			opts.registry.currentRelayRegistry[assetHubChainId];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(relayTokens, assetId);
		const isAssetHubNative = assetHubTokens[assetId] ? true : false;

		if (!isRelayNative && isNotANumber) {
			assetId = await getChainAssetId(api, assetId, specName);
		}

		const interior: InteriorMultiLocation = isHex(assetId)
			? api.registry.createType('InteriorMultiLocation', {
					X1: { GeneralKey: assetId },
			  })
			: isRelayNative
			? api.registry.createType('InteriorMultiLocation', { Here: '' })
			: api.registry.createType('InteriorMultiLocation', {
					X3: [
						{ Parachain: assetHubChainId },
						{ PalletInstance: palletId },
						{ GeneralIndex: assetId },
					],
			  });
		const parents = isRelayNative || isAssetHubNative ? 1 : 0;

		const multiAsset = {
			id: {
				Concrete: {
					parents,
					interior,
				},
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		if (xcmVersion === 2) {
			return {
				V2: multiAsset,
			};
		} else {
			return {
				V3: multiAsset,
			};
		}
	},

	createXTokensFeeAssetItem: (
		api: ApiPromise,
		opts: CreateFeeAssetItemOpts
	): XcmMultiLocation => {
		const { paysWithFeeDest, xcmVersion } = opts;

		if (xcmVersion && paysWithFeeDest) {
			const paysWithFeeMultiLocation = api.registry.createType(
				'MultiLocation',
				JSON.parse(paysWithFeeDest)
			);

			if (xcmVersion === 2) {
				return {
					V2: {
						id: {
							Concrete: paysWithFeeMultiLocation,
						},
					},
				};
			}

			return {
				V3: {
					id: {
						Concrete: paysWithFeeMultiLocation,
					},
				},
			};
		}

		throw new BaseError('failed to create xTokens fee multilocation');
	},
};

const createXTokensMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	xcmVersion: number,
	specName: string,
	assets: string[],
	opts: CreateAssetsOpts
): Promise<VersionedMultiAssets> => {
	const assetHubChainId = 1000;
	const { assetsPalletInstance } =
		opts.registry.currentRelayRegistry[assetHubChainId];
	const palletId = assetsPalletInstance as string;
	const { tokens: relayTokens } = opts.registry.currentRelayRegistry['0'];
	const { assetsInfo: assetHubTokens } =
		opts.registry.currentRelayRegistry[assetHubChainId];

	const multiAssets = [];
	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		let assetId = assets[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(relayTokens, assetId);
		const isAssetHubNative = assetHubTokens[assetId] ? true : false;

		if (!isRelayNative && isNotANumber) {
			assetId = await getChainAssetId(api, assetId, specName);
		}

		const interior: InteriorMultiLocation = isHex(assetId)
			? api.registry.createType('InteriorMultiLocation', {
					X1: { GeneralKey: assetId },
			  })
			: isRelayNative
			? api.registry.createType('InteriorMultiLocation', { Here: '' })
			: api.registry.createType('InteriorMultiLocation', {
					X3: [
						{ Parachain: assetHubChainId },
						{ PalletInstance: palletId },
						{ GeneralIndex: assetId },
					],
			  });
		const parents = isRelayNative || isAssetHubNative ? 1 : 0;

		const multiAsset = {
			id: {
				Concrete: {
					parents,
					interior,
				},
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		multiAssets.push(multiAsset);
	}

	if (xcmVersion === 2) {
		const multiAssetsType: MultiAssetsV2 = api.registry.createType(
			'XcmV2MultiassetMultiAssets',
			multiAssets
		);

		return Promise.resolve(
			api.registry.createType('XcmVersionedMultiAssets', {
				V2: multiAssetsType,
			})
		);
	} else {
		if (xcmVersion === 2) {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV2MultiassetMultiAssets',
				multiAssets
			);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V2: multiAssetsType,
				})
			);
		} else {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV3MultiassetMultiAssets',
				multiAssets
			);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V3: multiAssetsType,
				})
			);
		}
	}
};

/**
 * Create multiassets for ParaToSystem direction.
 *
 * @param api
 * @param amounts
 * @param specName
 * @param assets
 * @param registry
 */
const createParaToSystemMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	registry: Registry,
	isForeignAssetsTransfer?: boolean
): Promise<MultiAsset[]> => {
	// This will always result in a value and will never be null because the assets-hub will always
	// have the assets pallet present, so we type cast here to work around the type compiler.
	const assetHubChainId = '1000';
	const relayChainId = '0';
	const { assetsPalletInstance, foreignAssetsPalletInstance } =
		registry.currentRelayRegistry[assetHubChainId];
	const assetsPalletId = assetsPalletInstance as string;
	const foreignAssetsPalletId = foreignAssetsPalletInstance as string;
	let multiAssets: MultiAsset[] = [];

	const { tokens } = registry.currentRelayRegistry[relayChainId];

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		let assetId = assets[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative && isNotANumber) {
			assetId = await getChainAssetId(
				api,
				assetId,
				specName,
				isForeignAssetsTransfer
			);
		}

		let concretMultiLocation: MultiLocation;

		if (isForeignAssetsTransfer) {
			concretMultiLocation = constructForeignAssetMultiLocationFromAssetId(
				api,
				assetId,
				foreignAssetsPalletId
			);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: InteriorMultiLocation = isHex(assetId)
				? api.registry.createType('InteriorMultiLocation', {
						X1: { GeneralKey: assetId },
				  })
				: isRelayNative
				? api.registry.createType('InteriorMultiLocation', { Here: '' })
				: api.registry.createType('InteriorMultiLocation', {
						X2: [{ PalletInstance: assetsPalletId }, { GeneralIndex: assetId }],
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
