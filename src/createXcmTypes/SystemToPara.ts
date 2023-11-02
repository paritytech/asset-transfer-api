// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types';
import type { WeightLimitV2 } from '@polkadot/types/interfaces';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../errors';
import type { Registry } from '../registry';
import type { RequireOnlyOne } from '../types';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { validateNumber } from '../validate';
import type {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	FungibleStrMultiAsset,
	ICreateXcmType,
	IWeightLimit,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBenificiary,
	XcmV2Junctions,
	XcmV3Junctions,
} from './types';
import { constructForeignAssetMultiLocationFromAssetId } from './util/constructForeignAssetMultiLocationFromAssetId';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getAssetId } from './util/getAssetId';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { isSystemChain } from './util/isSystemChain';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const SystemToPara: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmDestBenificiary => {
		if (xcmVersion == 2) {
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

		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };

		return {
			V3: {
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
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (destId: string, xcmVersion?: number): XcmDestBenificiary => {
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
		const { registry, isForeignAssetsTransfer, isLiquidTokenTransfer, api } = opts;
		const sortedAndDedupedMultiAssets = await createSystemToParaMultiAssets(
			api,
			amounts,
			specName,
			assets,
			registry,
			xcmVersion,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer
		);

		if (xcmVersion === 2) {
			return Promise.resolve({
				V2: sortedAndDedupedMultiAssets,
			});
		} else {
			return Promise.resolve({
				V3: sortedAndDedupedMultiAssets,
			});
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
	createFeeAssetItem: async (api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<u32> => {
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
		if (xcmVersion && xcmVersion === 3 && specName && amounts && assetIds && paysWithFeeDest) {
			const multiAssets = await createSystemToParaMultiAssets(
				api,
				normalizeArrToStr(amounts),
				specName,
				assetIds,
				registry,
				xcmVersion,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer
			);

			const systemChainId = registry.lookupChainIdBySpecName(specName);
			if (!isSystemChain(systemChainId)) {
				throw new BaseError(
					`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
					BaseErrorsEnum.InternalError
				);
			}

			const assetIndex = await getFeeAssetItemIndex(
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
};

/**
 * Creates and returns a MultiAsset array for system parachains based on provided specName, assets and amounts
 *
 * @param api ApiPromise[]
 * @param amounts string[]
 * @param specName string
 * @param assets string[]
 */
export const createSystemToParaMultiAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	registry: Registry,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean
): Promise<FungibleStrMultiAsset[]> => {
	let multiAssets: FungibleStrMultiAsset[] = [];
	const palletId = fetchPalletInstanceId(api, isLiquidTokenTransfer, isForeignAssetsTransfer);
	const systemChainId = registry.lookupChainIdBySpecName(specName);

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

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, isForeignAssetsTransfer);
		}

		let concreteMultiLocation: UnionXcmMultiLocation;

		if (isForeignAssetsTransfer) {
			concreteMultiLocation = constructForeignAssetMultiLocationFromAssetId(assetId, palletId, xcmVersion);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: RequireOnlyOne<XcmV3Junctions | XcmV2Junctions> = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
				  };

			concreteMultiLocation = {
				parents,
				interior,
			};
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

	multiAssets = sortMultiAssetsAscending(multiAssets) as FungibleStrMultiAsset[];

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets) as FungibleStrMultiAsset[];

	return sortedAndDedupedMultiAssets;
};
