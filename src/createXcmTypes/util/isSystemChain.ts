import BN from 'bn.js';

import { validateNumber } from '../../validate/index.js';

/**
 * Determines if a chain is a system chain based on the value of its chainId being strictly greater than 0 and less than 2000
 * @param chainId
 * @returns boolean
 */
export const isSystemChain = (chainId: string): boolean => {
	if (validateNumber(chainId)) {
		const chainIdAsNumber = new BN(chainId);
		return chainIdAsNumber.gt(new BN(0)) && chainIdAsNumber.lt(new BN(2000));
	}

	return false;
};
