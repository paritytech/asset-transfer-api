import { isEthereumAddress } from '@polkadot/util-crypto';

import { ParachainDestBeneficiaryInner, ParachainX2Interior } from '../types.js';

export const createParachainDestBeneficiaryInner = ({
	accountId,
	destChainId,
	parents,
}: {
	accountId: string;
	destChainId: string;
	parents: number;
}): ParachainDestBeneficiaryInner => {
	const X2: ParachainX2Interior = isEthereumAddress(accountId)
		? [{ Parachain: destChainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: destChainId }, { AccountId32: { id: accountId } }];
	return {
		parents,
		interior: { X2 },
	};
};
