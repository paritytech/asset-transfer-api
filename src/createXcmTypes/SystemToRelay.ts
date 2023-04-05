// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type {
	MultiAssetsV2,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';
import type { XcmV3MultiassetMultiAssets } from '@polkadot/types/lookup';

import { ICreateXcmType, IWeightLimit } from './types';

export const SystemToRelay: ICreateXcmType = {
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
		xcmVersion?: number
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
	 * @param paraId The destId in this case, which is the relay chain
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (
		api: ApiPromise,
		paraId: string,
		xcmVersion: number
	): VersionedMultiLocation => {
		// TODO: This line will never be hit, and we should consider adding the destination ID
		// to an options param as it is not needed for Chain -> Relay transfers.
		if (paraId !== '0') {
			throw Error('SystemToRelay must have a destination Id of 0');
		}
		if (xcmVersion === 2) {
			return api.registry.createType('XcmVersionedMultiLocation', {
				V2: {
					parents: 1,
					interior: {
						here: null,
					},
				},
			});
		}

		return api.registry.createType('XcmVersionedMultiLocation', {
			V2: {
				parents: 1,
				interior: {
					here: null,
				},
			},
		});
	},
	/**
	 * Create a VersionedMultiAsset type.
	 *
	 * @param assets
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number
	): VersionedMultiAssets => {
		const multiAssets = [];

		for (let i = 0; i < amounts.length; i++) {
			const amount = amounts[i];
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
			};

			multiAssets.push(multiAsset);
		}

		if (xcmVersion === 2) {
			const multiAssetsType: MultiAssetsV2 = api.registry.createType(
				'XcmV2MultiassetMultiAssets',
				multiAssets
			);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V2: multiAssetsType,
			});
		} else {
			const multiAssetsType: XcmV3MultiassetMultiAssets =
				api.registry.createType('XcmV3MultiassetMultiAssets', multiAssets);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V3: multiAssetsType,
			});
		}
	},
	/**
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
};
