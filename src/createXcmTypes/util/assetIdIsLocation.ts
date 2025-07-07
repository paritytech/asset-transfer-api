import { XcmCreator } from '../types.js';

export const assetIdIsLocation = ({ assetId, xcmCreator }: { assetId: string; xcmCreator: XcmCreator }): boolean => {
	if (!assetId.toLowerCase().includes('parents') || !assetId.toLowerCase().includes('interior')) {
		return false;
	}

	const location = xcmCreator.resolveMultiLocation(assetId);

	return Object.keys(location).length === 2;
};
