// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { ICreateXcmType, UnionXcmMultiAssets, XcmDestBeneficiary } from './types.js';
import { createSingleAsset } from './util/createAssets.js';
import { createBeneficiary } from './util/createBeneficiary.js';
import { createHereDest } from './util/createDest.js';
import { createWeightLimit } from './util/createWeightLimit.js';

export const SystemToRelay: ICreateXcmType = {
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
	 * @param destId The destId in this case, which is the relay chain.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (_: string, xcmVersion: number): XcmDestBeneficiary => {
		return createHereDest({ xcmVersion, parents: 1 });
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets: async (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
		return createSingleAsset({
			amounts,
			parents: 1,
			xcmVersion,
		});
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
		return await Promise.resolve(0);
	},
};
