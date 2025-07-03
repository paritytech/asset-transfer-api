import type { AnyJson } from '@polkadot/types/types';

import { XcmCreator, XcmMultiLocation } from '../types.js';

export const createXcmOnDestination = ({
	assets,
	beneficiary,
	customXcmOnDest,
	xcmCreator,
}: {
	assets: string[];
	beneficiary: XcmMultiLocation;
	customXcmOnDest?: string;
	xcmCreator: XcmCreator;
}): AnyJson => {
	const xcmMessage: AnyJson = customXcmOnDest
		? (JSON.parse(customXcmOnDest) as AnyJson)
		: [
				{
					depositAsset: {
						assets: {
							Wild: {
								AllCounted: assets.length,
							},
						},
						beneficiary,
					},
				},
			];

	return xcmCreator.xcmMessage(xcmMessage);
};
