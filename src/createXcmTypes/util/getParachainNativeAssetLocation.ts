import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import { SanitizedXcAssetsData } from '../../registry/types';
import { sanitizeKeys } from '../../util/sanitizeKeys';
import { UnionXcmMultiLocation, XcmV3Junction } from '../types';
import { parseLocationStrToLocation } from './parseLocationStrToLocation';

export const getParachainNativeAssetLocation = (
	registry: Registry,
	nativeAssetSymbol: string,
	destChainId?: string,
): UnionXcmMultiLocation => {
	if (!destChainId) {
		throw new BaseError('No destination chainId provided', BaseErrorsEnum.InternalError);
	}

	let location: UnionXcmMultiLocation | undefined = undefined;

	if (destChainId === '1000') {
		for (const relayRegistryKey in registry.getRelaysRegistry) {
			const paraXcAssets = registry.getRelaysRegistry[relayRegistryKey].xcAssetsData;

			if (paraXcAssets) {
				location = getNativeAssetLocation(nativeAssetSymbol, paraXcAssets);

				if (location) {
					return location;
				}
			}
		}
	} else {
		const paraXcAssets = registry.getRelaysRegistry[destChainId].xcAssetsData;

		if (paraXcAssets) {
			location = getNativeAssetLocation(nativeAssetSymbol, paraXcAssets);
			if (location) {
				return location;
			}
		}
	}

	throw new BaseError(`No location found for asset ${nativeAssetSymbol}`, BaseErrorsEnum.InvalidAsset);
};

const getNativeAssetLocation = (
	nativeAssetSymbol: string,
	paraXcAssets: SanitizedXcAssetsData[],
): UnionXcmMultiLocation | undefined => {
	let location: UnionXcmMultiLocation | undefined = undefined;

	for (const asset of paraXcAssets) {
		if (typeof asset.symbol === 'string' && asset.symbol.toLowerCase() === nativeAssetSymbol.toLowerCase()) {
			// get the location from v1
			const v1LocationStr = asset.xcmV1MultiLocation;
			location = parseLocationStrToLocation(v1LocationStr);

			// handle case where result is an xcmV1Multilocation from the registry
			if ('v1' in location) {
				location = location.v1 as UnionXcmMultiLocation;
			}

			location.interior = sanitizeKeys(location.interior);

			if (location.interior.X2) {
				location = {
					parents: 0,
					interior: {
						X1: location.interior.X2[1] as XcmV3Junction,
					},
				};
			} else if (location.interior.X1) {
				location = {
					parents: 0,
					interior: {
						X1: location.interior.X1 as XcmV3Junction,
					},
				};
			}
		}
	}

	return location;
};
