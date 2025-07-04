import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const assetIdIsLocation = (assetId: string): boolean => {
	if (!assetId.toLowerCase().includes('parents') || !assetId.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation(assetId, DEFAULT_XCM_VERSION);

	return Object.keys(location).length === 2;
};
