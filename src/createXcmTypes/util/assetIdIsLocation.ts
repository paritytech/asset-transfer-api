import { XcmCreator } from '../types.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const assetIdIsLocation = ({ assetId, xcmCreator }: { assetId: string; xcmCreator: XcmCreator }): boolean => {
	if (!assetId.toLowerCase().includes('parents') || !assetId.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation({ locationStr: assetId, xcmCreator });

	return Object.keys(location).length === 2;
};
