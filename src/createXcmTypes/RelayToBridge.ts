// Copyright 2024 Parity Technologies (UK) Ltd.

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
} from './types.js';
import { createBeneficiary } from './util/createBeneficiary.js';
import { createInteriorValueDest } from './util/createDest.js';

export const RelayToBridge: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary,
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (destId: string, xcmVersion: number): XcmDestBeneficiary => {
		return createInteriorValueDest({
			destId,
			parents: 1,
			xcmVersion,
		});
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
		if (xcmVersion === 3) {
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
