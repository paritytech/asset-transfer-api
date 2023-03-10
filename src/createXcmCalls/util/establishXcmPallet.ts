import { ApiPromise } from '@polkadot/api';

enum XcmPalletName {
	xcmPallet = 'xcmPallet',
	polkadotXcm = 'polkadotXcm',
}

/**
 * Determine whether or the given api has an acceptable xcm pallet
 * for constructing asset transfer extrinsics. It will return an enum with the
 * correct pallet name.
 *
 * @param api ApiPromise
 */
export const establishXcmPallet = (api: ApiPromise): XcmPalletName => {
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
