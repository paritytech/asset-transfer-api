// Copyright 2024 Parity Technologies (UK) Ltd.

/**
 * Determines if the dest chain is a Global Consensus origin based on the value of its assetId/location
 * @param assetId
 * @returns boolean
 */
export const assetDestIsBridge = (assetIds: string[]): boolean => {
	if (assetIds.length === 0) {
		return false;
	}

	return assetIds[0].toLowerCase().includes('globalconsensus');
};
