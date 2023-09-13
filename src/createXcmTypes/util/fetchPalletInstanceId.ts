// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';

/**
 * This fetches the metadata for the chain we are connected to and searches for the appropriate pallet and returns its index.
 *
 * @param api ApiPromise.
 * @param isLiquidToken Boolean to determine whether or not to fetch the PoolAssets id.
 */
export const fetchPalletInstanceId = (api: ApiPromise, isLiquidToken: boolean, isForeignAsset: boolean): string => {
	if (isLiquidToken && isForeignAsset) {
		throw new BaseError(
			"Can't find the appropriate pallet when both liquid tokens and foreign assets",
			BaseErrorsEnum.InternalError
		);
	}
	const palletName = isLiquidToken ? 'PoolAssets' : isForeignAsset ? 'ForeignAssets' : 'Assets';
	const pallet = api.registry.metadata.pallets.filter((pallet) => pallet.name.toString() === palletName);

	if (pallet.length === 0) {
		throw new BaseError(
			`No ${palletName} pallet available, can't find a valid PalletInstance.`,
			BaseErrorsEnum.PalletNotFound
		);
	}

	return pallet[0].index.toString();
};
