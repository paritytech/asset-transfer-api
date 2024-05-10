// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../../errors';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import { UnionXcmMultiLocation, XcmVersionedAssetId } from '../types';

export const createXcmVersionedAssetId = (destFeesAssetId: string, xcmVersion: number): XcmVersionedAssetId => {
	if (xcmVersion < 3) {
		throw new BaseError('XcmVersion must be greater than 2', BaseErrorsEnum.InvalidXcmVersion);
	}

	let remoteFeesId: XcmVersionedAssetId;
	const location = JSON.parse(destFeesAssetId) as UnionXcmMultiLocation;

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
