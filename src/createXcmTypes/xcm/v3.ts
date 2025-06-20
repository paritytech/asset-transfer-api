import { isEthereumAddress } from '@polkadot/util-crypto';

import { XcmCreator, XcmDestBeneficiary, XcmDestBeneficiaryXcAssets, XcmV3DestBeneficiary } from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V3: XcmCreator = {
	createBeneficiary: ({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary => {
		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };
		return {
			V3: {
				parents,
				interior: { X1 },
			},
		};
	},

	createXTokensParachainDestBeneficiary: ({
		accountId,
		destChainId,
		parents = 1,
	}: {
		accountId: string;
		destChainId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets => {
		const beneficiary = createParachainDestBeneficiaryInner({
			accountId,
			destChainId,
			parents,
		});
		return { V3: beneficiary };
	},

	createXTokensDestBeneficiary: ({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets => {
		const X1 = { AccountId32: { id: accountId } };
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V3: beneficiary } as XcmV3DestBeneficiary;
	},
};
