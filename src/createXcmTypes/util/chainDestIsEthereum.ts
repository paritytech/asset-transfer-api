import { parseLocationStrToLocation } from './parseLocationStrToLocation';

export const chainDestIsEthereum = (destLocation: string): boolean => {
	if (!destLocation.toLowerCase().includes('parents') || !destLocation.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation(destLocation);

	const destIsEthereum = location.interior.X1
		? JSON.stringify(location.interior.X1).toLowerCase().includes('ethereum')
		: false;

	return destIsEthereum;
};
