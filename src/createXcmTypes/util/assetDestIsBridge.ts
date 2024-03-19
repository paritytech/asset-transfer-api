// Copyright 2024 Parity Technologies (UK) Ltd.

/**
 * Determines if assetId locations are valid bridge transaction asset locations
 * @param assetIds
 * @returns boolean
 */
export const assetDestIsBridge = (assetIds: string[]): boolean => {
	if (assetIds.length === 0) {
		return false;
	}

	for (const assetId of assetIds) {
		if (!assetId.toLowerCase().includes('globalconsensus')) {
			return false;
		}
	}

	return true;
};
