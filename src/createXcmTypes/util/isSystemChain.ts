// Copyright 2023 Parity Technologies (UK) Ltd.
import BN from 'bn.js';

/**
 * Determines if a chain is a system chain based on the value of its chainId being strictly greater than 0 and less than 2000
 * @param chainId
 * @returns boolean
 */
export const isSystemChain = (chainId: string): boolean => {
	const chainIdAsNumber = new BN(chainId);
	return chainIdAsNumber.gt(new BN(0)) && chainIdAsNumber.lt(new BN(2000));
};
