import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

/**
 * Determines if the dest chain is a Global Consensus origin based on the value of its dest location
 * @param destLocation
 * @returns boolean
 */
export const chainDestIsBridge = (destLocation: string): boolean => {
	const location = parseLocationStrToLocation(destLocation, DEFAULT_XCM_VERSION);
	let destIsBridge = false;

	if (location.interior) {
		destIsBridge = location.interior.X1
			? JSON.stringify(location.interior.X1).toLowerCase().includes('globalconsensus')
			: location.interior.X2
				? JSON.stringify(location.interior.X2).toLowerCase().includes('globalconsensus')
				: false;
	}

	return destIsBridge;
};
