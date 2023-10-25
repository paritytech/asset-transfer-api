// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type { WeightLimitV2 } from '@polkadot/types/interfaces';

import { BaseError, BaseErrorsEnum } from '../errors';
import type { Registry } from '../registry';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
import { validateNumber } from '../validate';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	FungibleStrMultiAsset,
	ICreateXcmType,
	IWeightLimit,
	UnionXcmMultiLocation,
	UnionXcmMultiAssets,
	XcmBase,
} from './types';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getAssetId } from './util/getAssetId';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { isSystemChain } from './util/isSystemChain';
import { dedupeMultiAssets } from './util/dedupeMultiAssets';
import { sortMultiAssetsAscending } from './util/sortMultiAssetsAscending';

export const SystemToSystem: ICreateXcmType = {
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
		const { registry, isForeignAssetsTransfer, isLiquidTokenTransfer, api } = opts;

		const sortedAndDedupedMultiAssets = await createSystemToSystemMultiAssets(
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
			return Promise.resolve(
				{
					V2: sortedAndDedupedMultiAssets,
				}
			);
		} else {
			return Promise.resolve({
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
			const multiAssets = await createSystemToSystemMultiAssets(
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

			const assetIndex = getFeeAssetItemIndex(
				api,
				registry,
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmVersion,
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
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean
): Promise<FungibleStrMultiAsset[]> => {
	let multiAssets: FungibleStrMultiAsset[] = [];
	const systemChainId = registry.lookupChainIdBySpecName(specName);
	const palletId = fetchPalletInstanceId(api, isLiquidTokenTransfer, isForeignAssetsTransfer);

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
			const assetIdMultiLocation = resolveMultiLocation(assetId, xcmVersion);

			// start of the junctions values of the assetId. + 1 to ignore the '['
			const junctionsStartIndex = assetId.indexOf('[') + 1;
			// end index of the junctions values of the assetId
			const junctionsEndIndex = assetId.indexOf(']');
			// e.g. {"Parachain": "2125"}, {"GeneralIndex": "0"}
			const junctions = assetId.slice(junctionsStartIndex + 1, junctionsEndIndex);
			// number of junctions found in the assetId. used to determine the number of junctions
			// after adding the PalletInstance (e.g. 2 junctions becomes X3)
			const junctionCount = junctions.split('},').length + 1;

			const numberOfJunctions = `"X${junctionCount}"`;
			const palletInstanceJunctionStr = `{"PalletInstance":"${palletId}"},`;
			const interiorMultiLocationStr = `{${numberOfJunctions}:[${palletInstanceJunctionStr}${junctions}]}`;

			concreteMultiLocation = resolveMultiLocation(
				{
					parents: assetIdMultiLocation.parents,
					interior: JSON.parse(interiorMultiLocationStr),
				},
				xcmVersion
			);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
				  };
			concreteMultiLocation = resolveMultiLocation(
				{
					parents,
					interior,
				},
				xcmVersion
			);
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
