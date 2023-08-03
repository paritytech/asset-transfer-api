// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Direction } from '../../types';

enum XcmPalletName {
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
	// isForeignAssetsTransfer?: boolean
): XcmPalletName => {
	// checks for xTokens pallet
	// for direction ParaToSystem, if it exists and tx is 
	// not a foreign assets transfer we use the xTokens pallet
	if (
		// isParaToSystemAssetsPalletTx(api, direction, isForeignAssetsTransfer)
		direction &&
		(direction === Direction.ParaToSystem ||
			direction === Direction.ParaToPara) &&
		api.tx.xTokens
	) {
		return XcmPalletName.xTokens;
	}

	if (api.tx.polkadotXcm) {
		return XcmPalletName.polkadotXcm;
	} else if (api.tx.xcmPallet) {
		return XcmPalletName.xcmPallet;
	} else {
		throw Error(
			"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
		);
	}
};

// const isParaToSystemAssetsPalletTx = (
// 	api: ApiPromise,
// 	direction?: Direction,
// 	isForeignAssetsTransfer?: boolean,
// 	): boolean => {
// 	if (
// 		isForeignAssetsTransfer != undefined && 
// 		!isForeignAssetsTransfer && 
// 		direction && 
// 		(direction === Direction.ParaToSystem || direction === Direction.ParaToPara) && 
// 		api.tx.xTokens
// 		) {
// 			return true;
// 		}

// 		return false;
// }


