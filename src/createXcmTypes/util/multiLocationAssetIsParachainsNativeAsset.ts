// Copyright 2023 Parity Technologies (UK) Ltd.

/**
 * Given a multilocation assetId and destChainId, returns if the multilocation is the native asset of the destchain
 *
 * @param destChainId The destination chain Id
 * @param multiLocationAssetId multilocation asset id
 */
export const multiLocationAssetIsParachainsNativeAsset = (
	destChainId: string,
	multiLocationAssetId: string
): boolean => {
	const destChainMultiLocationid = `"Parachain":"${destChainId}"`;

	if (
		multiLocationAssetId
			.toLowerCase()
			.trim()
			.replace(/ /g, '') // remove all empty spaces
			.includes(destChainMultiLocationid.toLowerCase().trim().replace(/ /g, ''))
	) {
		return true;
	}

	return false;
};
