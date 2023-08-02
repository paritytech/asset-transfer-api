// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { u32 } from '@polkadot/types';
import type {
	MultiAssetsV2,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';

import { ICreateXcmType, IWeightLimit } from './types';
/**
 * XCM type generation for transactions from the relay chain to a system parachain.
 */
export const RelayToSystem: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation type for a beneficiary.
	 *
	 * @param api ApiPromise
	 * @param accountId The accountId of the beneficiary
	 * @param xcmVersion The accepted xcm version
	 */
	createBeneficiary: (
		api: ApiPromise,
		accountId: string,
		xcmVersion: number
	): VersionedMultiLocation => {
		if (xcmVersion === 2) {
			return api.registry.createType('XcmVersionedMultiLocation', {
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
			});
		}

		return api.registry.createType('XcmVersionedMultiLocation', {
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
		});
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param api ApiPromise
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (
		api: ApiPromise,
		destId: string,
		xcmVersion: number
	): VersionedMultiLocation => {
		if (xcmVersion === 2) {
			return api.registry.createType('XcmVersionedMultiLocation', {
				V2: {
					parents: 0,
					interior: {
						X1: {
							parachain: destId,
						},
					},
				},
			});
		}

		return api.registry.createType('XcmVersionedMultiLocation', {
			V3: {
				parents: 0,
				interior: {
					X1: {
						parachain: destId,
					},
				},
			},
		});
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
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		_: string
	): Promise<VersionedMultiAssets> => {
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
		};

		multiAssets.push(multiAsset);

		if (xcmVersion === 2) {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV2MultiassetMultiAssets',
				multiAssets
			);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V2: multiAssetsType,
				})
			);
		} else {
			const multiAssetsType: XcmV3MultiassetMultiAssets =
				api.registry.createType('XcmV3MultiassetMultiAssets', multiAssets);

			return Promise.resolve(
				api.registry.createType('XcmVersionedMultiAssets', {
					V3: multiAssetsType,
				})
			);
		}
	},
	/**
	 * TODO: Generalize the weight type with V3.
	 * Create a WeightLimitV2 type.
	 *
	 * @param api ApiPromise
	 * @param weightLimit WeightLimit passed in as an option.
	 */
	createWeightLimit: (api: ApiPromise, weightLimit?: string): WeightLimitV2 => {
		const limit: IWeightLimit = weightLimit
			? { Limited: weightLimit }
			: { Unlimited: null };

		return api.registry.createType('XcmV2WeightLimit', limit);
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
