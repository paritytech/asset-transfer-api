import { isEthereumAddress } from '@polkadot/util-crypto';

import { XcmCreator, XcmDestBeneficiary, XcmDestBeneficiaryXcAssets, XcmV2DestBeneficiary } from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V2: XcmCreator = {
	createBeneficiary: ({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary => {
		const X1 = isEthereumAddress(accountId)
			? { AccountKey20: { network: 'Any', key: accountId } }
			: { AccountId32: { network: 'Any', id: accountId } };
		return {
			V2: {
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
		return { V2: beneficiary };
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
		return { V2: beneficiary } as XcmV2DestBeneficiary;
	},
};
