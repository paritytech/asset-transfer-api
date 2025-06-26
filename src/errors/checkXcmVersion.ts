import { SUPPORTED_XCM_VERSIONS } from '../consts.js';
import { BaseError, BaseErrorsEnum } from './BaseError.js';

/**
 * Check that an inputted xcm version is supported. If not throw an error.
 *
 * @param version Xcm version
 */
export const checkXcmVersion = (version: number) => {
	if (!SUPPORTED_XCM_VERSIONS.includes(version)) {
		throw new BaseError(
			`${version} is not a supported xcm version. Supported versions are: ${SUPPORTED_XCM_VERSIONS[0]}, ${SUPPORTED_XCM_VERSIONS[1]} and ${SUPPORTED_XCM_VERSIONS[2]}`,
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}
};
