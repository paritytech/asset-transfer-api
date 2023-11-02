// Copyright 2023 Parity Technologies (UK) Ltd.
import BN from 'bn.js';

/**
 * Determines if a chain is a parachain based on the value of its chainId being strictly greater than or equal to 2000
 * @param chainId
 * @returns boolean
 */
export const isParachain = (chainId: string): boolean => {
	const chainIdAsNumber = new BN(chainId);
	return chainIdAsNumber.gte(new BN(2000));
};
