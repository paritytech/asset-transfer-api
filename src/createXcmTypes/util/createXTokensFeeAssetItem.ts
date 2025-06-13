import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	CreateFeeAssetItemOpts,
	UnionXcAssetsMultiLocation,
	XcmV2MultiLocation,
	XcmV3MultiLocation,
	XcmV4MultiLocation,
	XcmV5MultiLocation,
} from '../types.js';

/**
 * Create an xTokens xcm `feeAssetItem`.
 *
 * @param opts Options used for creating `feeAssetItem`.
 */
export const createXTokensFeeAssetItem = ({
	paysWithFeeDest,
	xcmVersion,
}: CreateFeeAssetItemOpts): UnionXcAssetsMultiLocation => {
	if (!(xcmVersion && paysWithFeeDest)) {
		throw new BaseError(
			'failed to create xTokens fee multilocation. "paysWithFeeDest" and "xcmVersion" are both required.',
			BaseErrorsEnum.InternalError,
		);
	}

	const paysWithFeeMultiLocation = resolveMultiLocation(paysWithFeeDest, xcmVersion);

	switch (xcmVersion) {
		case 2:
			return {
				V2: { id: { Concrete: paysWithFeeMultiLocation as XcmV2MultiLocation } },
			};
		case 3:
			return {
				V3: { id: { Concrete: paysWithFeeMultiLocation as XcmV3MultiLocation } },
			};
		case 4:
			return { V4: { id: paysWithFeeMultiLocation as XcmV4MultiLocation } };
		case 5:
			return { V5: { id: paysWithFeeMultiLocation as XcmV5MultiLocation } };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
