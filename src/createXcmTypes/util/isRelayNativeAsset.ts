// Copyright 2023 Parity Technologies (UK) Ltd.

export const isRelayNativeAsset = (
	tokens: string[],
	assetId: string
): boolean => {
	for (const token of tokens) {
		if (token.toLowerCase() === assetId.toLowerCase()) {
			return true;
		}
	}

	return false;
};
