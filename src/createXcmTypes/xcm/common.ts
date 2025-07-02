import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { X2BeneficiaryInner, X2BeneficiaryVariant } from '../types.js';

export const createParachainDestBeneficiaryInner = ({
	accountId,
	destChainId,
	parents,
}: {
	accountId: string;
	destChainId: string;
	parents: number;
}): X2BeneficiaryVariant => {
	const chainId = Number(destChainId);
	if (isNaN(chainId)) {
		throw new BaseError('destChainId expected to be string representation of an integer', BaseErrorsEnum.InvalidInput);
	}
	const X2: X2BeneficiaryInner = isEthereumAddress(accountId)
		? [{ Parachain: chainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: chainId }, { AccountId32: { id: accountId } }];
	return {
		parents,
		interior: { X2 },
	};
};
