// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../types';

/**
 * For System origin XCM V3 Tx's, if paysWithFeeDest option is provided, finds the index
 * of the MultiAsset to be used for fees on the destination chain and places it at index 0
 *
 * @param paysWithFeeDest string
 * @param assets string[]
 * @param multiAssets MultiAsset[]
 */
export const applyPaysWithFeeDestination = (
	paysWithFeeDest: string,
	assets: string[],
	multiAssets: MultiAsset[]
): MultiAsset | string => {
	// type RelayAssetSymbol = 'dot' | 'ksm' | 'wnd';

	let result: MultiAsset | string =
		'destination chain fee asset was not updated';

	if (paysWithFeeDest) {
		const isRelayFeeAsset = (
			paysWithFeeDest.toLowerCase() === 'dot' 
			|| paysWithFeeDest.toLowerCase() === 'ksm'
			|| paysWithFeeDest.toLowerCase() === 'wnd'
			|| paysWithFeeDest.toLocaleLowerCase() === '0'
			);

		
			if (isRelayFeeAsset) {
				const relayMultiAssetInterior = { Here: '' };

				for (let i = 0; i < multiAssets.length; i++) {
					const multiAsset = multiAssets[i];

					if (multiAsset.id.Concrete.interior === relayMultiAssetInterior) {

					}
				}
			}

		for (let i = 0; i < multiAssets.length; i++) {
			const assetId = assets[i];

			// find the asset the user wants to pay the fee with on the dest chain
			// change the selected asset to be the first asset in the list
			if (assetId.toLowerCase() === paysWithFeeDest.toLowerCase() && i != 0) {
				const temp = multiAssets[0];
				multiAssets[0] = multiAssets[i];
				multiAssets[i] = temp;
				result = multiAssets[0];
			}
		}
	}

	return result;
};
