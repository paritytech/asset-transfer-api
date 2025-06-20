import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { UnionXcAssetsMultiLocation, XcmCreator } from '../types.js';

/**
 * Create an xTokens xcm `feeAssetItem`.
 *
 * @param opts Options used for creating `feeAssetItem`.
 */
export const createXTokensFeeAssetItem = ({
	paysWithFeeDest,
	xcmCreator,
}: {
	paysWithFeeDest?: string;
	xcmCreator: XcmCreator;
}): UnionXcAssetsMultiLocation => {
	if (!paysWithFeeDest) {
		throw new BaseError(
			'failed to create xTokens fee multilocation. "paysWithFeeDest" is required.',
			BaseErrorsEnum.InternalError,
		);
	}

	const paysWithFeeMultiLocation = resolveMultiLocation(paysWithFeeDest, xcmCreator);
	return xcmCreator.multiLocation(paysWithFeeMultiLocation);
};
