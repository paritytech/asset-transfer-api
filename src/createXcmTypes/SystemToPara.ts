import { ApiPromise } from '@polkadot/api';
import {
	MultiLocation,
	VersionedMultiAssets,
} from '@polkadot/types/interfaces';

import { SupportedXcmVersions, ICreateXcmType } from './types';

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
		xcmVersion?: SupportedXcmVersions
	): MultiLocation => {
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
		paraId: number,
		xcmVersion?: SupportedXcmVersions
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
	 * TODO: Find out how to find PalletInstance (number) of Assets
	 *
	 * @param assets
	 * @param amounts
	 * @param xcmVersion
	 */
	createAssets: (
		api: ApiPromise,
		assets: string[],
		amounts: (string | number)[],
		xcmVersion: number
	): VersionedMultiAssets => {
		/**
		 * Defaults to V1 if not V0
		 */
		if (xcmVersion === 0) {
			const multiAssets = [];

			for (let i = 0; i < assets.length; i++) {
				const assetId = assets[i];
				const amount = amounts[i];
				const multiAsset = {
					ConcreteFungible: {
						id: {
							X2: [{ PalletInstance: 50 }, { GeneralIndex: assetId }],
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
			// TODO: Find palletInstance.
			const multiAssets = [];

			for (let i = 0; i < assets.length; i++) {
				const assetId = assets[i];
				const amount = amounts[i];
				const multiAsset = {
					id: {
						Concrete: {
							parents: 0,
							interior: {
								X2: [{ PalletInstance: 50 }, { GeneralIndex: assetId }],
							},
						},
					},
					fun: {
						Fungible: amount,
					},
				};

				multiAssets.push(multiAsset);
			}

			const multiAssetsType = api.registry.createType(
				'XcmV1MultiassetMultiAssets',
				multiAssets
			);

			return api.registry.createType('XcmVersionedMultiAssets', {
				V1: multiAssetsType,
			});
		}
	}
}
