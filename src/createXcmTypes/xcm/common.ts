import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { XcmJunction, XcmMultiLocation } from '../types.js';

export function createParachainBeneficiary({
	accountId,
	destChainId,
	parents,
}: {
	accountId: string;
	destChainId: string;
	parents: number;
}): XcmMultiLocation {
	const chainId = Number(destChainId);
	if (isNaN(chainId)) {
		throw new BaseError('destChainId expected to be string representation of an integer', BaseErrorsEnum.InvalidInput);
	}
	const X2: [XcmJunction, XcmJunction] = isEthereumAddress(accountId)
		? [{ Parachain: chainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: chainId }, { AccountId32: { id: accountId } }];
	return {
		parents,
		interior: { X2 },
	};
}
