// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../errors';
import {
	CreateWeightLimitOpts,
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	InteriorValue,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
	XcmV4JunctionDestBeneficiary,
	XcmWeight,
} from './types';
import { parseLocationStrToLocation } from './util/parseLocationStrToLocation';

export const RelayToBridge: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmDestBeneficiary => {
		if (xcmVersion === 3) {
			const X1 = isEthereumAddress(accountId)
				? { AccountKey20: { key: accountId } }
				: { AccountId32: { id: accountId } };

			return {
				V3: {
					parents: 0,
					interior: {
						X1,
					},
				},
			};
		}

		const X1 = isEthereumAddress(accountId)
			? [{ AccountKey20: { key: accountId } }]
			: [{ AccountId32: { id: accountId } }];

		return {
			V4: {
				parents: 0,
				interior: {
					X1,
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (destId: string, xcmVersion: number): XcmDestBeneficiary => {
		const destination = parseLocationStrToLocation(destId);
		let dest: XcmDestBeneficiary | undefined = undefined;

		if (xcmVersion === 3) {
			dest =
				destination.interior && destination.interior.X1
					? {
							V3: {
								parents: 1,
								interior: {
									X1: destination.interior.X1 as InteriorValue,
								},
							},
					  }
					: {
							V3: {
								parents: 1,
								interior: {
									X2: destination.interior.X2 as InteriorValue,
								},
							},
					  };
		} else {
			if (destination.interior && destination.interior.X1) {
				dest = {
					V4: {
						parents: 1,
						interior: {
							X1: [destination.interior.X1 as XcmV4JunctionDestBeneficiary],
						},
					},
				};
			} else if (destination.interior && destination.interior.X2) {
				dest = {
					V4: {
						parents: 1,
						interior: {
							X2: destination.interior.X2 as XcmV4JunctionDestBeneficiary[],
						},
					},
				};
			}
		}

		if (!dest) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return dest;
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets: async (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
		const multiAssets = [];
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
						parents: 0,
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
					parents: 0,
				},
			};
		}

		multiAssets.push(multiAsset);

		if (xcmVersion === 3) {
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
		return opts.weightLimit?.refTime && opts.weightLimit?.proofSize
			? {
					Limited: {
						refTime: opts.weightLimit?.refTime,
						proofSize: opts.weightLimit?.proofSize,
					},
			  }
			: { Unlimited: null };
	},
	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 */
	createFeeAssetItem: async (_: ApiPromise): Promise<number> => {
		return await Promise.resolve(0);
	},
};
