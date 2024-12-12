// Copyright 2024 Parity Technologies (UK) Ltd.

import { parseLocationStrToLocation } from './parseLocationStrToLocation';

export const assetIdIsLocation = (assetId: string): boolean => {
	if (!assetId.toLowerCase().includes('parents') || !assetId.toLowerCase().includes('interior')) {
		return false;
	}

	const location = parseLocationStrToLocation(assetId);

	return Object.keys(location).length === 2;
};
