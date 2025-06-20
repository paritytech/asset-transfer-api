import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { CreateFeeAssetItemOpts, UnionXcAssetsMultiLocation } from '../types.js';
import { getXcmCreator } from '../xcm/index.js';

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

	const xcmCreator = getXcmCreator(xcmVersion);

	const paysWithFeeMultiLocation = resolveMultiLocation(paysWithFeeDest, xcmCreator);

	return xcmCreator.multiLocation(paysWithFeeMultiLocation);
};
