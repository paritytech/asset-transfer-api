// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import {
	FungibleStrAsset,
	FungibleStrMultiAsset,
	ICreateXcmType,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBeneficiary,
} from './types.js';
import { createBeneficiary } from './util/createBeneficiary.js';
import { createParachainDest } from './util/createDest.js';
import { createStrTypeMultiAsset } from './util/createMultiAsset.js';
import { createWeightLimit } from './util/createWeightLimit.js';
/**
 * XCM type generation for transactions from the relay chain to a system parachain.
 */
export const RelayToSystem: ICreateXcmType = {
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
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (destId: string, xcmVersion: number): XcmDestBeneficiary => {
		return createParachainDest({
			destId,
			parents: 0,
			xcmVersion,
		});
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets: async (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
		const multiAssets = [];

		const amount = amounts[0];
		const multiLocation: UnionXcmMultiLocation = {
			interior: {
				Here: '',
			},
			parents: 0,
		};

		const multiAsset = createStrTypeMultiAsset({
			amount,
			multiLocation,
			xcmVersion,
		});
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
	createWeightLimit,
	/**
	 * Return the correct feeAssetItem based on XCM direction.
	 * In this case it will always be zero since there is no `feeAssetItem` for this direction.
	 */
	createFeeAssetItem: async (_: ApiPromise): Promise<number> => {
		return Promise.resolve(0);
	},
};
