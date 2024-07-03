// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../../errors';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import { XcmVersionedAssetId } from '../types';
import { parseLocationStrToLocation } from './parseLocationStrToLocation';

export const createXcmVersionedAssetId = (
	destFeesAssetId: string | undefined,
	xcmVersion: number,
): XcmVersionedAssetId => {
	if (!destFeesAssetId) {
		throw new BaseError('resolveAssetTransferType: destFeesAssetId not found', BaseErrorsEnum.InvalidInput);
	}
	if (xcmVersion < 3) {
		throw new BaseError('XcmVersion must be greater than 2', BaseErrorsEnum.InvalidXcmVersion);
	}

	let remoteFeesId: XcmVersionedAssetId;
	const location = parseLocationStrToLocation(destFeesAssetId);

	if (xcmVersion === 3) {
		remoteFeesId = {
			V3: {
				Concrete: location,
			},
		};
	} else {
		remoteFeesId = {
			V4: resolveMultiLocation(location, 4),
		};
	}

	return remoteFeesId;
};
