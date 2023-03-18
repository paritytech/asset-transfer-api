// Copyright 2017-2023 Parity Technologies (UK) Ltd.
// This file is part of @substrate/asset-transfer-api.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import type { ApiPromise } from '@polkadot/api';
import type {
	MultiAssetsV1,
	MultiAssetV0,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

import { ICreateXcmType, IWeightLimit } from './types';

/**
 * XCM type generation for transactions from the relay chain to a parachain.
 */
export const RelayToPara: ICreateXcmType = {
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
		/**
		 * The main difference between V0 vs V1 is that there is no parent associated.
		 */
		if (xcmVersion === 0) {
			return api.registry.createType('XcmVersionedMultiLocation', {
				V0: {
					X1: {
						AccountId32: {
							network: 'Any',
							id: accountId,
						},
					},
				},
			});
		}

		/**
		 * This accounts for an xcmVersion of 1, or if no xcmVersion is passed in
		 */
		return api.registry.createType('XcmVersionedMultiLocation', {
			V1: {
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
	},
	/**
	 * Create a XcmVersionedMultiLocation type for a destination.
	 *
	 * @param api ApiPromise
	 * @param paraId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest: (
		api: ApiPromise,
		paraId: string,
		xcmVersion?: number
	): VersionedMultiLocation => {
		if (xcmVersion === 0) {
			return api.registry.createType('XcmVersionedMultiLocation', {
				V0: {
					X1: {
						parachain: paraId,
					},
				},
			});
		}

		/**
		 * This accounts for an xcmVersion of 1, or if no xcmVersion is passed in
		 */
		return api.registry.createType('XcmVersionedMultiLocation', {
			V1: {
				parents: 0,
				interior: {
					X1: {
						parachain: paraId,
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
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number
	): VersionedMultiAssets => {
		/**
		 * Defaults to V1 if not V0
		 */
		if (xcmVersion === 0) {
			const multiAssets: MultiAssetV0[] = [];

			for (let i = 0; i < amounts.length; i++) {
				const amount = amounts[i];
				const multiAsset = {
					ConcreteFungible: {
						id: {
							Null: '',
						},
						amount,
					},
				};

				multiAssets.push(
					api.registry.createType('XcmV0MultiAsset', multiAsset)
				);
			}

			return api.registry.createType('XcmVersionedMultiAssets', {
				V0: multiAssets,
			});
		} else {
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
							parents: 0,
						},
					},
				};

				multiAssets.push(multiAsset);
			}

			const multiAssetsType: MultiAssetsV1 = api.registry.createType(
				'XcmV1MultiassetMultiAssets',
				multiAssets
			);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V1: multiAssetsType,
			});
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
};
