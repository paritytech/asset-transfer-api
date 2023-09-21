// Copyright 2023 Parity Technologies (UK) Ltd.
import { SUPPORTED_XCM_VERSIONS } from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors/BaseError';

enum MuliLocationVersions {
	XcmV3MultiLocation = 'XcmV3MultiLocation',
	XcmV2MultiLocation = 'XcmV2MultiLocation',
}

export const resolveMultiLocation = (multiLocationStr: string, xcmVersion: number): MuliLocationVersions => {
	// Ensure we check this first since the main difference between v2, and v3 is `globalConsensus`
	if (multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus')) {
		return MuliLocationVersions.XcmV3MultiLocation;
	}

	if (!SUPPORTED_XCM_VERSIONS.includes(xcmVersion)) {
		throw new BaseError(`Invalid XcmVersion for mulitLocation construction`, BaseErrorsEnum.InternalError);
	}

	if (xcmVersion === 2) {
		return MuliLocationVersions.XcmV2MultiLocation;
	} else {
		return MuliLocationVersions.XcmV3MultiLocation;
	}
};
