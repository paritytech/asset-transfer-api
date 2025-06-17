// Copyright 2024 Parity Technologies (UK) Ltd.

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { XcmVersionedAssetId } from '../types.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const createXcmVersionedAssetId = (
	destFeesAssetId: string | undefined,
	xcmVersion: number = DEFAULT_XCM_VERSION,
): XcmVersionedAssetId => {
	if (!destFeesAssetId) {
		throw new BaseError('resolveAssetTransferType: destFeesAssetId not found', BaseErrorsEnum.InvalidInput);
	}
	if (xcmVersion < 3) {
		throw new BaseError('XcmVersion must be greater than 2', BaseErrorsEnum.InvalidXcmVersion);
	}

	let location = parseLocationStrToLocation(destFeesAssetId);

	if (typeof location === 'object' && 'v1' in location) {
		location = parseLocationStrToLocation(JSON.stringify(location.v1));
	}

	switch (xcmVersion) {
		// xcm V2 was explicitly not supported previously
		case 3:
			return { V3: { Concrete: location } };
		case 4:
			return { V4: resolveMultiLocation(location, xcmVersion) };
		case 5:
			return { V5: resolveMultiLocation(location, xcmVersion) };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
