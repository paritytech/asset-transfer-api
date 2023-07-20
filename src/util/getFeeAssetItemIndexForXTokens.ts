// Copyright 2023 Parity Technologies (UK) Ltd.

import { getSystemChainTokenSymbolGeneralIndex } from '../createXcmTypes/util/getTokenSymbolGeneralIndex';
import { XCMV2MultiAsset, XCMV3MultiAsset, XcmMultiAsset } from '../types';
import { NonRelayNativeInterior, RelayNativeInterior } from '../types';

/**
 * For System origin XCM V3 Tx's, if paysWithFeeDest option is provided, finds and returns the index
 * of the MultiAsset to be used for fees on the destination chain
 *
 * @param paysWithFeeDest string
 * @param multiAssets MultiAsset[]
 * @param specName string
 */
export const getFeeAssetItemIndexForXTokens = (
	paysWithFeeDest: string,
	multiAssets: XcmMultiAsset[],
	specName: string,
    xcmVersion: number
): number => {
	let result = 0;

	if (paysWithFeeDest) {
		const isRelayFeeAsset =
			paysWithFeeDest.toLowerCase() === 'dot' ||
			paysWithFeeDest.toLowerCase() === 'ksm' ||
			paysWithFeeDest.toLowerCase() === 'wnd';

		for (let i = 0; i < multiAssets.length; i++) {
			const multiAsset = multiAssets[i];

			if (isRelayFeeAsset) {
                if(xcmVersion === 2) {
				// if the asset id is a relay asset, match Here interior
				if (
					((multiAsset as XCMV2MultiAsset).V2.id.Concrete.interior.isHere)
				) {
					result = i;
					break;
				}
                } else {
                    if (
                        ((multiAsset as XCMV3MultiAsset).V3.id.Concrete.interior.isHere)
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
