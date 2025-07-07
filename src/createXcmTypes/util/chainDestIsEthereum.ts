import { XcmCreator } from '../types.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

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

	const location = parseLocationStrToLocation({ locationStr: destLocation, xcmCreator });

	const destIsEthereum = location.interior.X1
		? JSON.stringify(location.interior.X1).toLowerCase().includes('ethereum')
		: false;

	return destIsEthereum;
};
