import { DEFAULT_XCM_VERSION, SUPPORTED_XCM_VERSIONS } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { InteriorKey, InteriorValue, XcmDestBeneficiary, XcmV4JunctionDestBeneficiary } from '../types.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

/**
 * Create a XcmVersionedMultiLocation type for a destination with Here
 */
export const createHereDest = ({
	parents,
	xcmVersion = DEFAULT_XCM_VERSION,
}: {
	parents: number;
	xcmVersion: number;
}): XcmDestBeneficiary => {
	const versionKey = `V${xcmVersion}`;
	const destination = {
		[versionKey]: {
			parents,
			interior: { Here: null },
		},
	};
	if (!SUPPORTED_XCM_VERSIONS.includes(xcmVersion)) {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}

	return destination;
};

/**
 * Create a XcmVersionedMultiLocation type for a destination with InteriorValue
 */
export const createInteriorValueDest = ({
	destId,
	parents,
	xcmVersion = DEFAULT_XCM_VERSION,
}: {
	destId: string;
	parents: number;
	xcmVersion: number;
}): XcmDestBeneficiary => {
	// effectively copied from RelayToBridge.ts and SystemToBridge.ts
	const versionKey = `V${xcmVersion}`;
	const destination = {
		[versionKey]: {
			parents,
			interior: {},
		},
	};

	const multiLocation = parseLocationStrToLocation(destId);

	let interior: InteriorKey | undefined = undefined;
	if (xcmVersion == 3) {
		if (multiLocation && multiLocation.interior.X1) {
			interior = { X1: multiLocation.interior.X1 as InteriorValue };
		} else {
			interior = { X2: multiLocation.interior.X2 as InteriorValue };
		}
	} else if ([4, 5].includes(xcmVersion)) {
		if (multiLocation && multiLocation.interior.X1) {
			interior = { X1: [multiLocation.interior.X1 as XcmV4JunctionDestBeneficiary] };
		} else if (multiLocation && multiLocation.interior.X2) {
			interior = { X2: multiLocation.interior.X2 as XcmV4JunctionDestBeneficiary[] };
		}
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}

	if (!interior) {
		throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
	}
	destination[versionKey].interior = interior;

	return destination;
};
