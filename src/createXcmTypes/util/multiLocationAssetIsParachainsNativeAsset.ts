// Copyright 2023 Parity Technologies (UK) Ltd.

/**
 * Returns whether a provided multilocation is native to a parachain
 *
 * @param chainID The Id of the chain to be checked
 * @param multiLocationAssetId multilocation asset id
 */
export const multiLocationAssetIsParachainsNativeAsset = (chainId: string, multiLocationAssetId: string): boolean => {
	const destChainMultiLocationid = `"Parachain":"${chainId}"`;

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
