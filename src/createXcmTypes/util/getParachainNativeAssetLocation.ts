import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { Registry } from '../../registry/index.js';
import { SanitizedXcAssetsData } from '../../registry/types.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import { XcmCreator, XcmJunction, XcmMultiLocation } from '../types.js';

export const getParachainNativeAssetLocation = ({
	registry,
	nativeAssetSymbol,
	destChainId,
	xcmCreator,
}: {
	registry: Registry;
	nativeAssetSymbol: string;
	destChainId?: string;
	xcmCreator: XcmCreator;
}): XcmMultiLocation => {
	if (!destChainId) {
		throw new BaseError('No destination chainId provided', BaseErrorsEnum.InternalError);
	}

	let location: XcmMultiLocation | undefined = undefined;

	if (destChainId === '1000') {
		for (const relayRegistryKey in registry.getRelaysRegistry) {
			const paraXcAssets = registry.getRelaysRegistry[relayRegistryKey].xcAssetsData;

			if (paraXcAssets) {
				location = getNativeAssetLocation({ nativeAssetSymbol, paraXcAssets, xcmCreator });

				if (location) {
					return location;
				}
			}
		}
	} else {
		const paraXcAssets = registry.getRelaysRegistry[destChainId].xcAssetsData;

		if (paraXcAssets) {
			location = getNativeAssetLocation({ nativeAssetSymbol, paraXcAssets, xcmCreator });
			if (location) {
				return location;
			}
		}
	}

	throw new BaseError(`No location found for asset ${nativeAssetSymbol}`, BaseErrorsEnum.InvalidAsset);
};

const getNativeAssetLocation = ({
	nativeAssetSymbol,
	paraXcAssets,
	xcmCreator,
}: {
	nativeAssetSymbol: string;
	paraXcAssets: SanitizedXcAssetsData[];
	xcmCreator: XcmCreator;
}): XcmMultiLocation | undefined => {
	let location: XcmMultiLocation | undefined = undefined;

	for (const asset of paraXcAssets) {
		if (typeof asset.symbol === 'string' && asset.symbol.toLowerCase() === nativeAssetSymbol.toLowerCase()) {
			// get the location from v1
			const v1LocationStr = asset.xcmV1MultiLocation;
			location = xcmCreator.resolveMultiLocation(v1LocationStr);

			// handle case where result is an xcmV1Multilocation from the registry
			if (typeof location === 'object' && 'v1' in location) {
				location = location.v1 as XcmMultiLocation;
			}

			location.interior = sanitizeKeys(location.interior);

			if (location.interior.X2) {
				location = {
					parents: 0,
					interior: {
						X1: location.interior.X2[1] as XcmJunction,
					},
				};
			} else if (location.interior.X1) {
				location = {
					parents: 0,
					interior: {
						X1: location.interior.X1 as XcmJunction,
					},
				};
			}
		}
	}

	return location;
};
