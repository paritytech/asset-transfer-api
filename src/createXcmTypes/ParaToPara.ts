// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types';
import type { WeightLimitV2 } from '@polkadot/types/interfaces';
import type { AnyJson } from '@polkadot/types/types';

import { BaseError, BaseErrorsEnum } from '../errors';
import { Registry } from '../registry';
import { SanitizedXcAssetsData, XCMAssetRegistryMultiLocation } from '../registry/types';
import {
	Direction,
	XCMDestBenificiary,
} from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
import { validateNumber } from '../validate';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,	
	FungibleObjMultiAsset,
	FungibleStrMultiAsset,
	ICreateXcmType,
	IWeightLimit,
	UnionXcAssetsMultiLocation,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiAsset,
	UnionXcmMultiAssets,
	XcmBase,
	XcmV3MultiLocation,
} from './types';
import { constructForeignAssetMultiLocationFromAssetId } from './util/constructForeignAssetMultiLocationFromAssetId';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getAssetId } from './util/getAssetId';
import { isParachainPrimaryNativeAsset } from './util/isParachainPrimaryNativeAsset';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const ParaToPara: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmBase => {
		if (xcmVersion == 2) {
			return {
				V2: {
					parents: 0,
					interior: {
						X1: { AccountId32: { network: 'Any', id: accountId } },
					},
				},
			};
		}

		return {
			V3: {
				parents: 0,
				interior: {
					X1: { AccountId32: { id: accountId } },
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (destId: string, xcmVersion?: number): XcmBase => {
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
	},
	/**
	 * Create a VersionedMultiAsset type.
	 *
	 * @param assets
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: async (
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	): Promise<UnionXcmMultiAssets> => {
		const { registry, isForeignAssetsTransfer } = opts;

		const sortedAndDedupedMultiAssets = await createParaToParaMultiAssets(
			opts.api,
			amounts,
			specName,
			assets,
			xcmVersion,
			registry,
			isForeignAssetsTransfer
		);

		if (xcmVersion === 2) {
			return Promise.resolve(
				{
					V2: sortedAndDedupedMultiAssets,
				}
			);
		} else {

			return Promise.resolve(
				{
					V3: sortedAndDedupedMultiAssets,
				}
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
	createWeightLimit: (api: ApiPromise, opts: CreateWeightLimitOpts): WeightLimitV2 => {
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
	createFeeAssetItem: async (api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<u32> => {
		const { registry, paysWithFeeDest, specName, assetIds, amounts, xcmVersion, isForeignAssetsTransfer } = opts;
		if (xcmVersion && xcmVersion === 3 && specName && amounts && assetIds && paysWithFeeDest) {
			const multiAssets = await createParaToParaMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				xcmVersion,
				registry,
				isForeignAssetsTransfer
			);

			const assetIndex = getFeeAssetItemIndex(
				api,
				registry,
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmVersion,
				isForeignAssetsTransfer
			);

			return api.registry.createType('u32', assetIndex);
		}

		return api.registry.createType('u32', 0);
	},
	createXTokensBeneficiary: (destChainId: string, accountId: string, xcmVersion: number): XCMDestBenificiary => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 1,
					interior: {
						X2: [{ Parachain: destChainId }, { AccountId32: { id: accountId } }],
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
		amounts: string[],
		xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts
	): Promise<UnionXcAssetsMultiAssets> => {
		return await createXTokensMultiAssets(amounts, xcmVersion, specName, assets, opts);
	},
	createXTokensAsset: async (
		amount: string,
		xcmVersion: number,
		specName: string,
		assetId: string,
		opts: CreateAssetsOpts
	): Promise<UnionXcAssetsMultiAsset> => {
		const { registry } = opts;
		const { tokens: relayTokens } = registry.currentRelayRegistry['0'];
		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(relayTokens, assetId);

		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId(opts.api, registry, assetId, specName, xcmVersion);
		}

		const paraId = registry.lookupChainIdBySpecName(specName);
		const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData as SanitizedXcAssetsData[];

		let xcAsset = '';
		for (const info of paraXcAssets) {
			if (typeof info.asset === 'string' && info.asset === assetId) {
				xcAsset = info.xcmV1MultiLocation;
				break;
			}
		}

		const parsedMultiLocation = JSON.parse(xcAsset) as XCMAssetRegistryMultiLocation;
		const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

		const concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);

		const multiAsset = {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		if (xcmVersion === 2) {
			return { V2: multiAsset };
		} else {
			return { V3: multiAsset };
		}
	},

	createXTokensFeeAssetItem: (opts: CreateFeeAssetItemOpts): UnionXcAssetsMultiLocation => {
		const { paysWithFeeDest, xcmVersion } = opts;

		if (xcmVersion && paysWithFeeDest) {
			const paysWithFeeMultiLocation = resolveMultiLocation(paysWithFeeDest, xcmVersion);

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
						Concrete: paysWithFeeMultiLocation as XcmV3MultiLocation,
					},
				},
			};
		}

		throw new BaseError('failed to create xTokens fee multilocation', BaseErrorsEnum.InternalError);
	},
};

const createXTokensMultiAssets = async (
	amounts: string[],
	xcmVersion: number,
	specName: string,
	assets: string[],
	opts: CreateAssetsOpts
): Promise<UnionXcAssetsMultiAssets> => {
	const { registry } = opts;
	let multiAssets: FungibleObjMultiAsset[] = [];

	for (let i = 0; i < assets.length; i++) {
		const amount = amounts[i];
		let assetId = assets[i];

		const isValidInt = validateNumber(assetId);

		if (!isValidInt) {
			assetId = await getAssetId(opts.api, registry, assetId, specName, xcmVersion);
		}

		const paraId = registry.lookupChainIdBySpecName(specName);
		const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData as SanitizedXcAssetsData[];

		let xcAsset = '';
		for (const info of paraXcAssets) {
			if (typeof info.asset === 'string' && info.asset === assetId) {
				xcAsset = info.xcmV1MultiLocation;
				break;
			}
		}

		const parsedMultiLocation = JSON.parse(xcAsset) as XCMAssetRegistryMultiLocation;
		const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

		const concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);

		const multiAsset = {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		multiAssets.push(multiAsset);
	}

	multiAssets = sortMultiAssetsAscending(multiAssets) as FungibleObjMultiAsset[];
	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets) as FungibleObjMultiAsset[];
	if (xcmVersion === 2) {
		return Promise.resolve(
			{
				V2: sortedAndDedupedMultiAssets,
			}
		);
	} else {
		return Promise.resolve(
			{
				V3: sortedAndDedupedMultiAssets,
			}
		);
	}
};

/**
 * Create multiassets for ParaToPara direction.
 *
 * @param api
 * @param amounts
 * @param specName
 * @param assets
 * @param registry
 */
const createParaToParaMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	xcmVersion: number,
	registry: Registry,
	isForeignAssetsTransfer: boolean
): Promise<FungibleStrMultiAsset[]> => {
	const palletId = fetchPalletInstanceId(api, false, isForeignAssetsTransfer);
	let multiAssets: FungibleStrMultiAsset[] = [];
	let concreteMultiLocation;
	const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(
		registry,
		specName,
		Direction.ParaToPara,
		assets[0]
	);

	if (isPrimaryParachainNativeAsset) {
		concreteMultiLocation = resolveMultiLocation(
			{
				parents: 0,
				interior: { Here: '' },
			},
			xcmVersion
		);

		const multiAsset = {
			id: {
				Concrete: concreteMultiLocation,
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

			const isValidNumber = validateNumber(assetId);

			if (!isValidNumber && !isPrimaryParachainNativeAsset) {
				assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, isForeignAssetsTransfer);
			}

			const paraId = registry.lookupChainIdBySpecName(specName);
			const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData as SanitizedXcAssetsData[];

			let xcAsset = '';
			for (const info of paraXcAssets) {
				if (typeof info.asset === 'string' && info.asset === assetId) {
					xcAsset = info.xcmV1MultiLocation;
					break;
				}
			}

			const parsedMultiLocation = JSON.parse(xcAsset) as XCMAssetRegistryMultiLocation;
			const xcAssetMultiLocation = parsedMultiLocation.v1 as unknown as AnyJson;

			if (isForeignAssetsTransfer) {
				concreteMultiLocation = constructForeignAssetMultiLocationFromAssetId(assetId, palletId, xcmVersion);
			} else {
				concreteMultiLocation = resolveMultiLocation(xcAssetMultiLocation, xcmVersion);
			}

			const multiAsset = {
				id: {
					Concrete: concreteMultiLocation,
				},
				fun: {
					Fungible: amount,
				},
			};
			multiAssets.push(multiAsset);
		}
	}

	multiAssets = sortMultiAssetsAscending(multiAssets) as FungibleStrMultiAsset[];

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets) as FungibleStrMultiAsset[];

	return sortedAndDedupedMultiAssets;
};
