// Copyright 2023 Parity Technologies (UK) Ltd.

/**
 * Determines if a chain is a system chain based on the value of its chainId being strictly greater than 0 and less than 2000
 * @param chainId
 * @returns boolean
 */
export const isSystemChain = (chainId: string | number): boolean => {
	const chainIdAsNumber = typeof chainId === 'string' ? parseInt(chainId) : chainId;

	return chainIdAsNumber > 0 && chainIdAsNumber < 2000;
};
