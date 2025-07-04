import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { XcmCreator, XcmVersionedAssetId } from '../types.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const createXcmVersionedAssetId = (
	destFeesAssetId: string | undefined,
	xcmCreator: XcmCreator,
): XcmVersionedAssetId => {
	if (!destFeesAssetId) {
		throw new BaseError('createXcmVersionedAssetId: destFeesAssetId not found', BaseErrorsEnum.InvalidInput);
	}
	if (xcmCreator.xcmVersion < 3) {
		throw new BaseError('XcmVersion must be greater than 2', BaseErrorsEnum.InvalidXcmVersion);
	}

	let location = parseLocationStrToLocation({ locationStr: destFeesAssetId, xcmCreator });

	if (typeof location === 'object' && 'v1' in location) {
		location = parseLocationStrToLocation({ locationStr: JSON.stringify(location.v1), xcmCreator });
	}

	return xcmCreator.versionedAssetId(location);
};
