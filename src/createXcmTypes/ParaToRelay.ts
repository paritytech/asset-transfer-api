// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import {
	CreateWeightLimitOpts,
	ICreateXcmType,
	UnionXcAssetsMultiAsset,
	UnionXcmMultiAssets,
	XcmDestBenificiary,
	XcmDestBenificiaryXcAssets,
	XcmMultiAsset,
	XcmWeight,
} from './types';

export const ParaToRelay: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary: (accountId: string, xcmVersion: number): XcmDestBenificiary => {
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
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (_: string, xcmVersion: number): XcmDestBenificiary => {
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
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets: (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
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
	createXTokensBeneficiary: (_: string, accountId: string, xcmVersion: number): XcmDestBenificiaryXcAssets => {
		if (xcmVersion === 2) {
			return {
				V2: {
					parents: 1,
					interior: {
						X1: { AccountId32: { id: accountId } },
					},
				},
			};
		}

		return {
			V3: {
				parents: 1,
				interior: {
					X1: { AccountId32: { id: accountId } },
				},
			},
		};
	},
	createXTokensAsset: (amount: string, xcmVersion: number): Promise<UnionXcAssetsMultiAsset> => {
		const multiAsset = {
			id: {
				Concrete: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};

		if (xcmVersion === 2) {
			return Promise.resolve({ V2: multiAsset });
		} else {
			return Promise.resolve({ V3: multiAsset });
		}
	},
	// createXTokensFeeAssetItem: () => {

	// }
};
