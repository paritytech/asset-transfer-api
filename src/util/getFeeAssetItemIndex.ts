// Copyright 2023 Parity Technologies (UK) Ltd.

import { getSystemChainTokenSymbolGeneralIndex } from '../createXcmTypes/util/getTokenSymbolGeneralIndex';
import { MultiAsset } from '../types';
import { NonRelayNativeInterior, RelayNativeInterior } from '../types';

/**
 * For System origin XCM V3 Tx's, if paysWithFeeDest option is provided, finds and returns the index
 * of the MultiAsset to be used for fees on the destination chain
 *
 * @param paysWithFeeDest string
 * @param multiAssets MultiAsset[]
 * @param specName string
 */
export const getFeeAssetItemIndex = (
	paysWithFeeDest: string,
	multiAssets: MultiAsset[],
	specName: string
): number => {
	let result = 0;

	if (paysWithFeeDest) {
		const isRelayFeeAsset =
			paysWithFeeDest.toLowerCase() === 'dot' ||
			paysWithFeeDest.toLowerCase() === 'ksm' ||
			paysWithFeeDest.toLowerCase() === 'wnd' ||
			paysWithFeeDest === '0';

		for (let i = 0; i < multiAssets.length; i++) {
			const multiAsset = multiAssets[i];

			if (isRelayFeeAsset) {
				// if the asset id is a relay asset, match Here interior
				if (
					(multiAsset.id.Concrete.interior as RelayNativeInterior).Here === ''
				) {
					result = i;
					break;
				}
			} else {
				const parsedAssetIdAsNumber = Number.parseInt(paysWithFeeDest);
				const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);

				// if not a number, get the general index of the pays with fee asset
				// to compare against the current multi asset
				if (isNotANumber) {
					const paysWithFeeDestGeneralIndex =
						getSystemChainTokenSymbolGeneralIndex(paysWithFeeDest, specName);
					if (
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2 &&
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2[1]
							.GeneralIndex === paysWithFeeDestGeneralIndex
					) {
						result = i;
						break;
					}
				} else {
					if (
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2 &&
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2[1]
							.GeneralIndex === paysWithFeeDest
					) {
						result = i;
						break;
					}
				}
			}
		}
	}

	return result;
};
