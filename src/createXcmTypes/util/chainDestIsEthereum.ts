import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const chainDestIsEthereum = (destLocation: string): boolean => {
	if (!destLocation.toLowerCase().includes('parents') || !destLocation.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation(destLocation, DEFAULT_XCM_VERSION);

	const destIsEthereum = location.interior.X1
		? JSON.stringify(location.interior.X1).toLowerCase().includes('ethereum')
		: false;

	return destIsEthereum;
};
