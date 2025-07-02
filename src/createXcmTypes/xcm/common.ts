import { isEthereumAddress } from '@polkadot/util-crypto';

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
	const X2: X2BeneficiaryInner = isEthereumAddress(accountId)
		? [{ Parachain: destChainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: destChainId }, { AccountId32: { id: accountId } }];
	return {
		parents,
		interior: { X2 },
	};
};
