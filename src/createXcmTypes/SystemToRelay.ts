// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type { WeightLimitV2 } from '@polkadot/types/interfaces';

import {
	CreateWeightLimitOpts,
	ICreateXcmType,
	IWeightLimit,
	UnionXcmMultiAssets,
	XcmBase,
	XcmMultiAsset,
} from './types';

export const SystemToRelay: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmBase => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 0,
					interior: {
						X1: {
							AccountId32: {
								network: 'Any',
								id: accountId,
							},
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
						AccountId32: {
							id: accountId,
						},
					},
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (_: string, xcmVersion: number): XcmBase => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
		}

		return {
			V3: {
				parents: 1,
				interior: {
					Here: null,
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
	createAssets: async (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
		const multiAssets: XcmMultiAsset[] = [];

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
					parents: 1,
				},
			},
		} as XcmMultiAsset;

		multiAssets.push(multiAsset);

		if (xcmVersion === 2) {
			return Promise.resolve({
				V2: multiAssets,
			});
		} else {
			return Promise.resolve({
				V3: multiAssets,
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
	 */
	createFeeAssetItem: async (api: ApiPromise): Promise<u32> => {
		return Promise.resolve(api.registry.createType('u32', 0));
	},
};
