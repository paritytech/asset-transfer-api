import { XcmCreator } from '../types.js';

export const chainDestIsEthereum = ({
	destLocation,
	xcmCreator,
}: {
	destLocation: string;
	xcmCreator: XcmCreator;
}): boolean => {
	if (!destLocation.toLowerCase().includes('parents') || !destLocation.toLowerCase().includes('interior')) {
		return false;
	}

	const location = xcmCreator.resolveMultiLocation(destLocation);

	const destIsEthereum = location.interior.X1
		? JSON.stringify(location.interior.X1).toLowerCase().includes('ethereum')
		: false;

	return destIsEthereum;
};
