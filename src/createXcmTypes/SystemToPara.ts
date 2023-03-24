// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type {
	MultiAssetsV1,
	MultiAssetV0,
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

import { ICreateXcmType, IWeightLimit } from './types';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';

export const SystemToPara: ICreateXcmType = {
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
		 * Ensure that the `parents` field is a `1` when sending a destination MultiLocation
		 * from a system parachain to a sovereign parachain.
		 */
		return api.registry.createType('XcmVersionedMultiLocation', {
			V1: {
				parents: 1,
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
	 * @param assets
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		assets?: string[]
	): VersionedMultiAssets => {
		// TODO: We should consider a centralized place where these errors are check for.
		if (!assets) {
			throw Error(
				'Assets are required for constructing a MultiAsset from SystemToPara'
			);
		}
		const palletId = fetchPalletInstanceId(api);
		/**
		 * Defaults to V1 if not V0
		 */
		if (xcmVersion === 0) {
			const multiAssets: MultiAssetV0[] = [];

			for (let i = 0; i < assets.length; i++) {
				const assetId = assets[i];
				const amount = amounts[i];
				const multiAsset = {
					ConcreteFungible: {
						id: {
							X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
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

			for (let i = 0; i < assets.length; i++) {
				const assetId = assets[i];
				const amount = amounts[i];
				const multiAsset = {
					id: {
						Concrete: {
							parents: 0,
							interior: {
								X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
							},
						},
					},
					fun: {
						Fungible: amount,
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
