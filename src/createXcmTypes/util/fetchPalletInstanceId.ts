import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { XcmCreator } from '../types.js';
import { assetIdIsLocation } from './assetIdIsLocation.js';

/**
 * This fetches the metadata for the chain we are connected to and searches for the appropriate pallet and returns its index.
 *
 * @param api ApiPromise.
 * @param isLiquidToken Boolean to determine whether or not to fetch the PoolAssets id.
 */
export const fetchPalletInstanceId = ({
	api,
	assetId,
	isLiquidToken,
	isForeignAsset,
	xcmCreator,
}: {
	api: ApiPromise;
	assetId: string;
	isLiquidToken: boolean;
	isForeignAsset: boolean;
	xcmCreator: XcmCreator;
}): number => {
	if (isLiquidToken && isForeignAsset) {
		throw new BaseError(
			"Can't find the appropriate pallet when both liquid tokens and foreign assets",
			BaseErrorsEnum.InternalError,
		);
	}

	const palletName =
		isLiquidToken && api.query.poolAssets
			? 'PoolAssets'
			: isForeignAsset && api.query.foreignAssets && assetIdIsLocation({ assetId, xcmCreator })
				? 'ForeignAssets'
				: api.query.assets
					? 'Assets'
					: '';

	// throw error if assets pallet is not found and palletName is not PoolAssets or ForeignAssets
	if (!api.query.assets && palletName.length === 0) {
		throw new BaseError(`No pallet available, can't find a valid PalletInstance.`, BaseErrorsEnum.PalletNotFound);
	}

	const pallet = api.registry.metadata.pallets.filter((pallet) => pallet.name.toString() === palletName);

	if (pallet.length === 0) {
		throw new BaseError(
			`No ${palletName} pallet available, can't find a valid PalletInstance.`,
			BaseErrorsEnum.PalletNotFound,
		);
	}

	return pallet[0].index.toNumber();
};
