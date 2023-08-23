// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';
import { Direction } from '../../types';

export enum XcmPalletName {
	xcmPallet = 'xcmPallet',
	polkadotXcm = 'polkadotXcm',
	xTokens = 'xTokens',
}

/**
 * Determine whether or the given api has an acceptable xcm pallet
 * for constructing asset transfer extrinsics. It will return an enum with the
 * correct pallet name.
 *
 * @param api ApiPromise
 */
export const establishXcmPallet = (
	api: ApiPromise,
	direction?: Direction,
	isForeignAssetsTransfer?: boolean
): XcmPalletName => {
	// checks for the existence of the xTokens pallet
	// for direction ParaToSystem, if it exists and the tx is
	// not a foreign assets transfer we return the xTokens pallet
	if (
		isXTokensParaToSystemNonForeignAssetsPalletTx(
			api,
			direction,
			isForeignAssetsTransfer
		)
	) {
		return XcmPalletName.xTokens;
	}

	if (api.tx.polkadotXcm) {
		return XcmPalletName.polkadotXcm;
	} else if (api.tx.xcmPallet) {
		return XcmPalletName.xcmPallet;
	} else {
		throw new BaseError(
			"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API",
			BaseErrorsEnum.PalletNotFound
		);
	}
};

/**
 * Determines if the tx is an xTokens ParaToSystem non foreign assets pallet tx
 *
 * @param api ApiPromise
 */
const isXTokensParaToSystemNonForeignAssetsPalletTx = (
	api: ApiPromise,
	direction?: Direction,
	isForeignAssetsTransfer?: boolean
): boolean => {
	if (
		isForeignAssetsTransfer != undefined &&
		!isForeignAssetsTransfer &&
		direction &&
		direction === Direction.ParaToSystem &&
		api.tx.xTokens
	) {
		return true;
	}

	return false;
};
