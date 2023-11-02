// Copyright 2023 Parity Technologies (UK) Ltd.

export const isRelayNativeAsset = (tokens: string[], assetId: string): boolean => {
	// if assetId is an empty string treat it as the relay asset
	if (assetId === '') {
		return true;
	}

	for (const token of tokens) {
		if (token.toLowerCase() === assetId.toLowerCase()) {
			return true;
		}
	}

	return false;
};
