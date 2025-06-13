import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { FungibleObjAssetType, FungibleStrAssetType } from '../types.js';

export const createMultiAsset = ({
	amount,
	multiLocation,
	xcmVersion,
}: {
	amount: string;
	multiLocation: AnyJson;
	xcmVersion: number;
}): FungibleObjAssetType => {
	const concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);

	if ([2, 3].includes(xcmVersion)) {
		return {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: { Fungible: amount },
			},
		};
	} else if ([4, 5].includes(xcmVersion)) {
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: { Fungible: amount },
			},
		};
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};

/**
 * Same as createMultiAsset above but returns FungibleStrAssetType.
 *
 * This is mostly a hack around the difference between FungibleObjAssetType
 * and FungibleStringAssetType, the former of which has an extra nested "Fungible".
 * TODO: Resolve this issue as it does not appear to stem from the original
 * XCM version definitions.
 */
export const createStrTypeMultiAsset = ({
	amount,
	multiLocation,
	xcmVersion,
}: {
	amount: string;
	multiLocation: AnyJson;
	xcmVersion: number;
}): FungibleStrAssetType => {
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
