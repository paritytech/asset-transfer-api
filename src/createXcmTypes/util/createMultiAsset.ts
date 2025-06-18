import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { FungibleAssetType } from '../types.js';

export const createMultiAsset = ({
	amount,
	multiLocation,
	xcmVersion,
}: {
	amount: string;
	multiLocation: AnyJson;
	xcmVersion: number;
}): FungibleAssetType => {
	const concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);

	if ([2, 3].includes(xcmVersion)) {
		return {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: amount,
			},
		};
	} else if ([4, 5].includes(xcmVersion)) {
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: amount,
			},
		};
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
