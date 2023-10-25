// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type { WeightLimitV2 } from '@polkadot/types/interfaces';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { CreateWeightLimitOpts, ICreateXcmType, IWeightLimit, UnionXcmMultiAssets, XcmBase, XcmMultiAsset } from './types';

/**
 * XCM type generation for transactions from the relay chain to a parachain.
 */
export const RelayToPara: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmBase => {
		if (xcmVersion === 2) {
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
	createDest: (destId: string, xcmVersion?: number): XcmBase => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 0,
					interior: {
						X1: {
							Parachain: destId,
						},
					},
				},
			};
		}

		return {
			V3: {
				parents: 0,
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
	 * @param api ApiPromise
	 * @param assets Assets to be sent
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: async (
		amounts: string[],
		xcmVersion: number,
	): Promise<UnionXcmMultiAssets> => {
		const multiAssets = [];

		const amount = amounts[0];
		const multiAsset = {
			fun: {
				Fungible: amount,
			},
			id: {
				Concrete: {
					interior: {
						Here: '',
					},
					parents: 0,
				},
			},
		} as XcmMultiAsset;

		multiAssets.push(multiAsset);

		if (xcmVersion === 2) {
			return Promise.resolve(
				{
					V2: multiAssets,
				}
			);
		} else {
			return Promise.resolve(
				{
					V3: multiAssets,
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
	 * return the correct feeAssetItem based on XCM direction.
	 *
	 * @param api ApiPromise
	 */
	createFeeAssetItem: async (api: ApiPromise): Promise<u32> => {
		return await Promise.resolve(api.registry.createType('u32', 0));
	},
};
