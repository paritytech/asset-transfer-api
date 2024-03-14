// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { SUPPORTED_XCM_VERSIONS } from '../consts';
import type { UnionXcmMultiLocation } from '../createXcmTypes/types';
import { BaseError, BaseErrorsEnum } from '../errors/BaseError';
import { sanitizeKeys } from './sanitizeKeys';

/**
 * This ensures that the given multiLocation does not have certain junctions depending on the xcm version.
 *
 * @param multiLocation
 * @param xcmVersion
 * @returns
 */
export const resolveMultiLocation = (multiLocation: AnyJson, xcmVersion: number): UnionXcmMultiLocation => {
	const multiLocationStr = typeof multiLocation === 'string' ? multiLocation : JSON.stringify(multiLocation);
	// Ensure we check this first since the main difference between v2, and v3 is `globalConsensus`
	const hasGlobalConsensus =
		multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');
	if (xcmVersion < 3 && hasGlobalConsensus) {
		throw new BaseError(
			'XcmVersion must be greater than 2 for MultiLocations that contain a GlobalConsensus junction.',
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}

	// const hasGeneralKey = multiLocationStr.includes('generalKey') || multiLocationStr.includes('GeneralKey');
	// if (xcmVersion != 2 && hasGeneralKey) {
	// 	throw new BaseError(
	// 		'XcmVersion must be version 2 for MultiLocations that contain a GeneralKey junction.',
	// 		BaseErrorsEnum.InvalidXcmVersion,
	// 	);
	// }

	if (!SUPPORTED_XCM_VERSIONS.includes(xcmVersion)) {
		throw new BaseError(`Invalid XcmVersion for mulitLocation construction`, BaseErrorsEnum.InternalError);
	}

	if (!hasGlobalConsensus) {
		return sanitizeKeys(JSON.parse(multiLocationStr) as UnionXcmMultiLocation);
	} else {
		return JSON.parse(multiLocationStr) as UnionXcmMultiLocation;
	}
};
