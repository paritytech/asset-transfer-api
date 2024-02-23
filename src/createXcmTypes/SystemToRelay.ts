// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import {
	CreateWeightLimitOpts,
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
	XcmWeight,
} from './types';

export const SystemToRelay: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmDestBeneficiary => {
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

		if (xcmVersion === 3) {
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
		}

		return {
			V4: {
				parents: 0,
				interior: {
					X1: [
						{
							AccountId32: {
								id: accountId,
							},
						},
					],
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (_: string, xcmVersion: number): XcmDestBeneficiary => {
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

		if (xcmVersion === 3) {
			return {
				V3: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
		}

		return {
			V4: {
				parents: 1,
				interior: {
					Here: null,
				},
			},
		};
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets: async (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
		const multiAssets: FungibleStrAssetType[] = [];
		let multiAsset: FungibleStrAssetType;

		const amount = amounts[0];

		if (xcmVersion < 4) {
			multiAsset = {
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
			};
		} else {
			multiAsset = {
				fun: {
					Fungible: amount,
				},
				id: {
					interior: {
						Here: '',
					},
					parents: 1,
				},
			};
		}

		multiAssets.push(multiAsset);

		if (xcmVersion === 2) {
			return Promise.resolve({
				V2: multiAssets as FungibleStrMultiAsset[],
			});
		} else if (xcmVersion === 3) {
			return Promise.resolve({
				V3: multiAssets as FungibleStrMultiAsset[],
			});
		} else {
			return Promise.resolve({
				V4: multiAssets as FungibleStrAsset[],
			});
		}
	},
	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit: (opts: CreateWeightLimitOpts): XcmWeight => {
		return opts.isLimited && opts.weightLimit?.refTime && opts.weightLimit?.proofSize
			? {
					Limited: {
						refTime: opts.weightLimit?.refTime,
						proofSize: opts.weightLimit?.proofSize,
					},
			  }
			: { Unlimited: null };
	},
	/**
	 * Return the correct feeAssetItem based on XCM direction.
	 * In this case it will always be zero since there is no `feeAssetItem` for this direction.
	 */
	createFeeAssetItem: async (_: ApiPromise): Promise<number> => {
		return await Promise.resolve(0);
	},
};
