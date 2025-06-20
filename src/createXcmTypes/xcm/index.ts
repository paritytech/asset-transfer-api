import { XcmCreator, XcmVersionKey } from '../types.js';
import { V2 } from './v2.js';
import { V3 } from './v3.js';
import { V4 } from './v4.js';
import { V5 } from './v5.js';

type XcmCreatorLookup = {
	[key in XcmVersionKey]: XcmCreator;
};
const xcmCreators: XcmCreatorLookup = {
	V2,
	V3,
	V4,
	V5,
};

export const getXcmCreator = (xcmVersion: number): XcmCreator => {
	const key = `V${xcmVersion}` as keyof typeof XcmVersionKey;

	if (!(key in XcmVersionKey)) {
		throw new Error(`Invalid or Unsupported XCM version: ${xcmVersion}`);
	}

	return xcmCreators[key];
};

export { V2, V3, V4, V5 };
