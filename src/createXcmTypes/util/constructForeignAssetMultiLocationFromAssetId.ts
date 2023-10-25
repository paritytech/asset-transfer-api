// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { UnionXcmMultiLocation } from '../../createXcmTypes/types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';

/**
 * constructs a foreign asset multilocation from an assetId string
 * adds the correct PalletInstance to the multilocations junctions
 *
 * @param api
 * @param multiLocationAssetId
 * @param foreignAssetsPalletInstance
 * @returns
 */
export const constructForeignAssetMultiLocationFromAssetId = (
	multiLocationAssetId: string,
	foreignAssetsPalletInstance: string,
	xcmVersion: number
): UnionXcmMultiLocation => {
	const numberOfAdditionalJunctions = 1;
	const assetIdMultiLocation = resolveMultiLocation(multiLocationAssetId, xcmVersion);

	// start of the junctions values of the assetId. + 1 to ignore the '['
	const junctionsStartIndex = multiLocationAssetId.indexOf('[');
	// end index of the junctions values of the multiLocationAssetId
	const junctionsEndIndex = multiLocationAssetId.indexOf(']');
	// e.g. {"Parachain": "2125"}, {"GeneralIndex": "0"}
	const junctions = multiLocationAssetId.slice(junctionsStartIndex + 1, junctionsEndIndex);
	// number of junctions found in the assetId. used to determine the number of junctions
	// after adding the PalletInstance (e.g. 2 junctions becomes X3 for System origin)
	const junctionCount = junctions.split('},').length + numberOfAdditionalJunctions;

	const numberOfJunctions = `"X${junctionCount}"`;
	const palletInstanceJunctionStr = `{"PalletInstance":"${foreignAssetsPalletInstance}"},`;
	const interiorMultiLocationStr = `{${numberOfJunctions}:[${palletInstanceJunctionStr}${junctions}]}`;
	const multiLocation = {
		// TODO: keying into any xcm field should be standardized to all caps.
		parents: assetIdMultiLocation['Parents'] || assetIdMultiLocation['parents'],
		interior: JSON.parse(interiorMultiLocationStr) as AnyJson,
	};

	return resolveMultiLocation(multiLocation, xcmVersion);
};
