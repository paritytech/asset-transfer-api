import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const assetIdIsLocation = (assetId: string): boolean => {
	if (!assetId.toLowerCase().includes('parents') || !assetId.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation(assetId);

	return Object.keys(location).length === 2;
};
