import type { ApiPromise } from '@polkadot/api';
import type {
	MultiAssetV0,
	MultiAssetV1,
	MultiLocation,
	VersionedMultiAssets,
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
	): MultiLocation => {
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
	): MultiLocation => {
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

			return api.registry.createType('VersionedMultiAssets', {
				V0: multiAssets,
			});
		} else {
			const multiAssets: MultiAssetV1[] = [];

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

				multiAssets.push(
					api.registry.createType('XcmV0MultiAsset', multiAsset)
				);
			}
		}

		return api.registry.createType('VersionedMultiAssets');
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
