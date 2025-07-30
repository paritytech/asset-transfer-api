import { XcmCreator, XcmMultiLocation } from '../types.js';

/**
 * Determines if the dest chain is a Global Consensus origin based on the value of its dest location
 * @param destLocation
 * @returns boolean
 */
export const chainDestIsBridge = ({
	destLocation,
	xcmCreator,
}: {
	destLocation: string;
	xcmCreator: XcmCreator;
}): boolean => {
	let location: XcmMultiLocation;
	try {
		location = xcmCreator.resolveMultiLocation(destLocation);
	} catch {
		// Dest is not a multilocation and thus not a bridge
		return false;
	}
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
