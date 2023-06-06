// Copyright 2023 Parity Technologies (UK) Ltd.

import { getSystemChainTokenSymbolGeneralIndex } from '../createXcmTypes/util/getTokenSymbolGeneralIndex';
import { MultiAsset } from '../types';
import { NonRelayNativeInterior, RelayNativeInterior } from '../types';

const swapPayWithFeeDestMultiAssets = (
	multiAssets: MultiAsset[],
	swapIndex: number
) => {
	const temp = multiAssets[0];
	multiAssets[0] = multiAssets[swapIndex];
	multiAssets[swapIndex] = temp;
};

/**
 * For System origin XCM V3 Tx's, if paysWithFeeDest option is provided, finds the index
 * of the MultiAsset to be used for fees on the destination chain and places it at index 0
 *
 * @param paysWithFeeDest string
 * @param multiAssets MultiAsset[]
 * @param specName string
 */
export const applyPaysWithFeeDestination = (
	paysWithFeeDest: string,
	multiAssets: MultiAsset[],
	specName: string
): MultiAsset | string => {
	let result: MultiAsset | string =
		'destination chain fee asset was not updated';

	if (paysWithFeeDest) {
		console.log('what is paysWithFeesDest', paysWithFeeDest.toLowerCase());
		const isRelayFeeAsset =
			paysWithFeeDest.toLowerCase() === 'dot' ||
			paysWithFeeDest.toLowerCase() === 'ksm' ||
			paysWithFeeDest.toLowerCase() === 'wnd' ||
			paysWithFeeDest.toLowerCase() === '0';

		console.log('isRelayAsset', isRelayFeeAsset);

		for (let i = 0; i < multiAssets.length; i++) {
			const multiAsset = multiAssets[i];

			if (isRelayFeeAsset) {
				// if the asset id is a relay asset, match Here interior
				if (
					(multiAsset.id.Concrete.interior as RelayNativeInterior).Here ===
						'' &&
					i != 0
				) {
					swapPayWithFeeDestMultiAssets(multiAssets, i);
					result = multiAssets[0];
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
						swapPayWithFeeDestMultiAssets(multiAssets, i);
						result = multiAssets[0];
					}
				} else {
					if (
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2 &&
						(multiAsset.id.Concrete.interior as NonRelayNativeInterior).X2[1]
							.GeneralIndex === paysWithFeeDest
					) {
						swapPayWithFeeDestMultiAssets(multiAssets, i);
						result = multiAssets[0];
					}
				}
			}
		}
	}

	return result;
};
