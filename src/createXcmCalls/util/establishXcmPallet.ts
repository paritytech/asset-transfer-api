// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { SUPPORTED_XCM_PALLETS } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { Direction } from '../../types';

export enum XcmPalletName {
	xcmPallet = 'xcmPallet',
	polkadotXcm = 'polkadotXcm',
	xTokens = 'xTokens',
	xtokens = 'xtokens',
}

/**
 * Determine whether or the given api has an acceptable xcm pallet
 * for constructing asset transfer extrinsics. It will return an enum with the
 * correct pallet name.
 *
 * @param api ApiPromise
 */
export const establishXcmPallet = (api: ApiPromise, direction?: Direction): XcmPalletName => {
	let xPallet: XcmPalletName | undefined;

	// default to xTokens
	if (api.tx.xTokens) {
		xPallet = XcmPalletName.xTokens;
	} else if (api.tx.xtokens) {
		xPallet = XcmPalletName.xtokens;
	}

	// checks for the existence of the xTokens pallet
	// checks that current origin is a parachain
	if (isValidXTokensDirection(xPallet, direction)) {
		return xPallet as XcmPalletName;
	}

	if (api.tx.polkadotXcm) {
		return XcmPalletName.polkadotXcm;
	} else if (api.tx.xcmPallet) {
		return XcmPalletName.xcmPallet;
	}

	const supportedPallets = SUPPORTED_XCM_PALLETS.map((pallet) => {
		return pallet;
	}).join(', ');

	throw new BaseError(
		`No supported pallet found in the current runtime. Supported pallets are ${supportedPallets}.`,
		BaseErrorsEnum.PalletNotFound,
	);
};

/**
 * Determines if the tx is an xTokens ParaToSystem or ParaToPara non foreign assets pallet tx
 *
 * @param api ApiPromise
 */
const isValidXTokensDirection = (xPallet?: XcmPalletName, direction?: Direction): boolean => {
	if (
		direction &&
		(direction === Direction.ParaToSystem ||
			direction === Direction.ParaToPara ||
			direction === Direction.ParaToRelay) &&
		xPallet
	) {
		return true;
	}

	return false;
};
