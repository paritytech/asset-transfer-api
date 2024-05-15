// Copyright 2024 Parity Technologies (UK) Ltd.

import { UnionXcmMultiLocation } from '../types';

/**
 * Determines if the dest chain is a Global Consensus origin based on the value of its dest location
 * @param destLocation
 * @returns boolean
 */
export const chainDestIsBridge = (destLocation: string): boolean => {
	const location = JSON.parse(destLocation) as UnionXcmMultiLocation;

	if (
		location.interior &&
		location.interior.X1 &&
		JSON.stringify(location.interior.X1).toLowerCase().includes('globalconsensus')
	) {
		return true;
	}

	return false;
};
