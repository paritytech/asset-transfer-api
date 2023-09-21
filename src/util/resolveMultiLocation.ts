// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { SUPPORTED_XCM_VERSIONS } from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors/BaseError';
import type { UnionXcmMultiLocation } from '../types';

export const resolveMultiLocation = (
	api: ApiPromise,
	multiLocationStr: string,
	xcmVersion: number
): UnionXcmMultiLocation => {
	// Ensure we check this first since the main difference between v2, and v3 is `globalConsensus`
	if (multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus')) {
		return api.registry.createType('XcmV3MultiLocation', JSON.parse(multiLocationStr));
	}

	if (!SUPPORTED_XCM_VERSIONS.includes(xcmVersion)) {
		throw new BaseError(`Invalid XcmVersion for mulitLocation construction`, BaseErrorsEnum.InternalError);
	}

	if (xcmVersion === 2) {
		return api.registry.createType('XcmV2MultiLocation', JSON.parse(multiLocationStr));
	} else {
		return api.registry.createType('XcmV3MultiLocation', JSON.parse(multiLocationStr));
	}
};
