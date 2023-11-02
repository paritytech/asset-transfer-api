// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@polkadot/types/types';

import { SUPPORTED_XCM_VERSIONS } from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors/BaseError';
import type { UnionXcmMultiLocation } from '../types';

export const resolveMultiLocation = (
	api: ApiPromise,
	multiLocation: AnyJson,
	xcmVersion: number
): UnionXcmMultiLocation => {
	const multiLocationStr = typeof multiLocation === 'string' ? multiLocation : JSON.stringify(multiLocation);
	// Ensure we check this first since the main difference between v2, and v3 is `globalConsensus`
	if (multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus')) {
		return api.registry.createType('XcmV3MultiLocation', JSON.parse(multiLocationStr));
	}

	if (xcmVersion != 2 && (multiLocationStr.includes('generalKey') || multiLocationStr.includes('GeneralKey'))) {
		throw new BaseError(
			'XcmVersion must be version 2 for MultiLocations that contain a GeneralKey junction.',
			BaseErrorsEnum.InvalidXcmVersion
		);
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
