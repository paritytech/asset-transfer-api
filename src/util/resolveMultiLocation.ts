// Copyright 2023 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { SUPPORTED_XCM_VERSIONS } from '../consts';
import type { UnionXcmMultiLocation, XcmV4Junction } from '../createXcmTypes/types';
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

	// Ensure we check this first since the main difference between v2, and later versions is the `globalConsensus` junction
	const hasGlobalConsensus =
		multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');
	if (xcmVersion < 3 && hasGlobalConsensus) {
		throw new BaseError(
			'XcmVersion must be greater than 2 for MultiLocations that contain a GlobalConsensus junction.',
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}

	if (!SUPPORTED_XCM_VERSIONS.includes(xcmVersion)) {
		throw new BaseError(`Invalid XcmVersion for mulitLocation construction`, BaseErrorsEnum.InternalError);
	}

	let result = JSON.parse(multiLocationStr) as UnionXcmMultiLocation;

	if (xcmVersion > 3 && result.interior.X1) {
		result = {
			parents: result.parents,
			interior: {
				X1: [result.interior.X1 as XcmV4Junction],
			},
		};
	}

	if (!hasGlobalConsensus) {
		return sanitizeKeys(result);
	} else {
		return result;
	}
};
