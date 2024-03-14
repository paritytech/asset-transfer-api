// Copyright 2024 Parity Technologies (UK) Ltd.

/**
 * Determines if the dest chain is a Global Consensus origin based on the value of its dest location
 * @param destLocation
 * @returns boolean
 */
export const chainDestIsBridge = (destLocation: string): boolean => {
	return destLocation.toLowerCase().includes('globalconsensus');
};
