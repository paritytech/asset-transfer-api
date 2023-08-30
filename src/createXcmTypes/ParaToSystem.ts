// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types';
import type {
	MultiAssetsV2,
	MultiLocation,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';

import { ASSET_HUB_CHAIN_ID } from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors';
import { Registry } from '../registry';
import { XCMChainInfoDataKeys, XCMChainInfoKeys } from '../registry/types';
import {
	Direction,
	MultiAsset,
	XCMDestBenificiary,
	XcmMultiAsset,
	XcmMultiLocation,
	XcmVersionedMultiAsset,
} from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { validateNumber } from '../validate';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	ICreateXcmType,
	IWeightLimit,
} from './types';
import { constructForeignAssetMultiLocationFromAssetId } from './util/constructForeignAssetMultiLocationFromAssetId';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { getAssetId } from './util/getAssetId';
import { isParachainPrimaryNativeAsset } from './util/isParachainPrimaryNativeAsset';
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
			opts.isLimited && opts.weightLimit?.refTime && opts.weightLimit?.proofSize
				? {
						Limited: {
							refTime: opts.weightLimit.refTime,
							proofSize: opts.weightLimit.proofSize,
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
	): Promise<XcmVersionedMultiAsset> => {
		const { registry } = opts;
		const { xcAssets } = registry;
		const { tokens: relayTokens } = registry.currentRelayRegistry['0'];
		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(relayTokens, assetId);
		const currentRelayChainSpecName = opts.registry.relayChain;

		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName);
		}

		// once we have the parachain assetId, use it to get the multilocation from the xc asset registry
		let relayChainXcAssetInfoKeys: XCMChainInfoKeys[] = [];
		if (currentRelayChainSpecName.toLowerCase() === 'kusama') {
			relayChainXcAssetInfoKeys = xcAssets.kusama;
		}
		if (currentRelayChainSpecName.toLowerCase() === 'polkadot') {
			relayChainXcAssetInfoKeys = xcAssets.polkadot;
		}

		let xcAsset: XCMChainInfoDataKeys | string = '';
		for (let i = 0; i < relayChainXcAssetInfoKeys.length; i++) {
			const chainInfo = relayChainXcAssetInfoKeys[i];

			for (let j = 0; j < chainInfo.data.length; j++) {
				const xcAssetData = chainInfo.data[j];
				if (
					typeof xcAssetData.asset === 'string' &&
					xcAssetData.asset === assetId
				) {
					xcAsset = xcAssetData;
					break;
				}
			}
		}

		const xcAssetMultiLocation = (xcAsset as XCMChainInfoDataKeys)
			.xcmV1MultiLocation.v1;

		const concretMultiLocation = api.registry.createType(
			'MultiLocation',
			xcAssetMultiLocation
		);

		const multiAsset = {
			id: {
				Concrete: concretMultiLocation,
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

		throw new BaseError(
			'failed to create xTokens fee multilocation',
			BaseErrorsEnum.InternalError
		);
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
	const { registry } = opts;
	const { xcAssets } = registry;
	const currentRelayChainSpecName = registry.relayChain;

	let multiAssets: XcmMultiAsset[] = [];

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		let assetId = assets[i];

		const isValidInt = validateNumber(assetId);

		if (!isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName);
		}

		// once we have the parachain assetId, use it to get the multilocation from the xc asset registry
		let relayChainXcAssetInfoKeys: XCMChainInfoKeys[] = [];
		if (currentRelayChainSpecName.toLowerCase() === 'kusama') {
			relayChainXcAssetInfoKeys = xcAssets.kusama;
		}
		if (currentRelayChainSpecName.toLowerCase() === 'polkadot') {
			relayChainXcAssetInfoKeys = xcAssets.polkadot;
		}

		let xcAsset: XCMChainInfoDataKeys | string = '';
		for (let i = 0; i < relayChainXcAssetInfoKeys.length; i++) {
			const chainInfo = relayChainXcAssetInfoKeys[i];

			for (let j = 0; j < chainInfo.data.length; j++) {
				const xcAssetData = chainInfo.data[j];
				if (
					typeof xcAssetData.asset === 'string' &&
					xcAssetData.asset === assetId
				) {
					xcAsset = xcAssetData;
					break;
				}
			}
		}
		const xcAssetMultiLocation = (xcAsset as XCMChainInfoDataKeys)
			.xcmV1MultiLocation.v1;

		const concretMultiLocation = api.registry.createType(
			'MultiLocation',
			xcAssetMultiLocation
		);

		const multiAsset = {
			id: {
				Concrete: concretMultiLocation,
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		multiAssets.push(multiAsset);
	}

	multiAssets = sortMultiAssetsAscending(multiAssets) as XcmMultiAsset[];
	const sortedAndDedupedMultiAssets = dedupeMultiAssets(
		multiAssets
	) as XcmMultiAsset[];
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
		const multiAssetsType: MultiAssetsV2 = api.registry.createType(
			'XcmV3MultiassetMultiAssets',
			sortedAndDedupedMultiAssets
		);

		return Promise.resolve(
			api.registry.createType('XcmVersionedMultiAssets', {
				V3: multiAssetsType,
			})
		);
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
	isForeignAssetsTransfer: boolean
): Promise<MultiAsset[]> => {
	const { xcAssets } = registry;
	const currentRelayChainSpecName = registry.relayChain;
	const { foreignAssetsPalletInstance } =
		registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];
	// This will always result in a value and will never be null because the AssetHub will always
	// have the foreign assets pallet present, so we type cast here to work around the type compiler.
	const foreignAssetsPalletId = foreignAssetsPalletInstance as string;
	let multiAssets: MultiAsset[] = [];
	let concretMultiLocation: MultiLocation;
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToSystem,
		assets[0]
	);

	if (isPrimaryParachainNativeAsset) {
		concretMultiLocation = api.registry.createType('MultiLocation', {
			parents: 0,
			interior: { Here: '' },
		});

		const multiAsset = {
			id: {
				Concrete: concretMultiLocation,
			},
			fun: {
				Fungible: amounts[0],
			},
		};

		multiAssets.push(multiAsset);
	} else {
		for (let i = 0; i < assets.length; i++) {
			const amount = amounts[i];
			let assetId = assets[i];

			const parsedAssetIdAsNumber = Number.parseInt(assetId);
			const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);

			if (isNotANumber && !isPrimaryParachainNativeAsset) {
				assetId = await getAssetId(
					api,
					registry,
					assetId,
					specName,
					isForeignAssetsTransfer
				);
			}

			// once we have the parachain assetId, use it to get the multilocation from the xc asset registry
			let relayChainXcAssetInfoKeys: XCMChainInfoKeys[] = [];
			if (currentRelayChainSpecName.toLowerCase() === 'kusama') {
				relayChainXcAssetInfoKeys = xcAssets.kusama;
			}
			if (currentRelayChainSpecName.toLowerCase() === 'polkadot') {
				relayChainXcAssetInfoKeys = xcAssets.polkadot;
			}

			let xcAsset: XCMChainInfoDataKeys | string = '';
			for (let i = 0; i < relayChainXcAssetInfoKeys.length; i++) {
				const chainInfo = relayChainXcAssetInfoKeys[i];

				for (let j = 0; j < chainInfo.data.length; j++) {
					const xcAssetData = chainInfo.data[j];
					if (
						typeof xcAssetData.asset === 'string' &&
						xcAssetData.asset === assetId
					) {
						xcAsset = xcAssetData;
						break;
					}
				}
			}
			const xcAssetMultiLocation = (xcAsset as XCMChainInfoDataKeys)
				.xcmV1MultiLocation.v1;

			if (isForeignAssetsTransfer) {
				concretMultiLocation = constructForeignAssetMultiLocationFromAssetId(
					api,
					assetId,
					foreignAssetsPalletId
				);
			} else {
				concretMultiLocation = api.registry.createType(
					'MultiLocation',
					xcAssetMultiLocation
				);
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
	}

	multiAssets = sortMultiAssetsAscending(multiAssets) as MultiAsset[];

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(
		multiAssets
	) as MultiAsset[];

	return sortedAndDedupedMultiAssets;
};
