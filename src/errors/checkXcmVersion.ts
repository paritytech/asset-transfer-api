// Copyright 2023 Parity Technologies (UK) Ltd.

import { SUPPORTED_XCM_VERSIONS } from '../consts';
import { BaseError } from './BaseError';

/**
 * Check that an inputted xcm version is supported. If not throw an error.
 *
 * @param version Xcm version
 */
export const checkXcmVersion = (version: number) => {
	if (!SUPPORTED_XCM_VERSIONS.includes(version)) {
		throw new BaseError(
			`${version} is not a supported xcm version. Supported versions are: ${SUPPORTED_XCM_VERSIONS[0]} and ${SUPPORTED_XCM_VERSIONS[1]}`
		);
	}
};
