// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import {
	FungibleObjAsset,
	FungibleObjAssetType,
	FungibleObjMultiAsset,
	ICreateXcmType,
	UnionXcAssetsMultiAsset,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
} from './types.js';
import { createSingleAsset } from './util/createAssets.js';
import { createBeneficiary, createXTokensDestBeneficiary } from './util/createBeneficiary.js';
import { createHereDest } from './util/createDest.js';
import { createWeightLimit } from './util/createWeightLimit.js';

export const ParaToRelay: ICreateXcmType = {
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
	createAssets: (amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> => {
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
	createXTokensBeneficiary: (_: string, accountId: string, xcmVersion: number): XcmDestBeneficiaryXcAssets => {
		return createXTokensDestBeneficiary(accountId, xcmVersion);
	},
	createXTokensAsset: (amount: string, xcmVersion: number): Promise<UnionXcAssetsMultiAsset> => {
		let multiAsset: FungibleObjAssetType;

		if (xcmVersion < 4) {
			multiAsset = {
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
		} else {
			multiAsset = {
				id: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
				fun: {
					Fungible: { Fungible: amount },
				},
			};
		}

		if (xcmVersion === 2) {
			return Promise.resolve({ V2: multiAsset as FungibleObjMultiAsset });
		} else if (xcmVersion === 3) {
			return Promise.resolve({ V3: multiAsset as FungibleObjMultiAsset });
		} else {
			return Promise.resolve({ V4: multiAsset as FungibleObjAsset });
		}
	},
};
