import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { XcmCreator, XcmJunction, XcmJunctionForVersion, XcmMultiLocation, XcmVersionKey } from '../types.js';

export const parseLocationStrToLocation = ({
	locationStr,
	xcmCreator,
}: {
	locationStr: string;
	xcmCreator: XcmCreator;
}): XcmMultiLocation => {
	const xcmVersion = xcmCreator.xcmVersion;
	let location = '';
	const isX1V4Location = locationStr.includes(`X1":[`) && locationStr.includes(`]`);

	if (xcmVersion && xcmVersion <= 3 && isX1V4Location) {
		location = locationStr.replace('[', '').replace(']', '');
	} else {
		location = locationStr;
	}

	let multiLocation: XcmMultiLocation;
	try {
		multiLocation = JSON.parse(location) as XcmMultiLocation;
	} catch {
		throw new BaseError(`Unable to parse ${locationStr} as a valid location`, BaseErrorsEnum.InvalidInput);
	}

	// Wrap X1 in an array if using V4 or greater.
	// A bit hacky but avoids some type hell.
	// Should be fine as this is simply a safety net.
	// when inputing V2 and V3 locations with V4+.
	if (xcmVersion >= 4 && multiLocation?.interior?.X1 && !Array.isArray(multiLocation.interior.X1)) {
		let x1: XcmJunction;
		switch (xcmVersion) {
			case 4:
				x1 = multiLocation.interior.X1 as XcmJunctionForVersion<XcmVersionKey.V4>;
				break;
			case 5:
				x1 = multiLocation.interior.X1 as XcmJunctionForVersion<XcmVersionKey.V5>;
				break;
			default:
				throw new Error(`Unsupported or incompatible version for X1 wrapping: ${xcmVersion}`);
		}
		multiLocation.interior.X1 = [x1];
	}

	return multiLocation;
};
