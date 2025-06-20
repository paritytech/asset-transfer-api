import { XcmCreator, XcmDestBeneficiary, XcmDestBeneficiaryXcAssets, XcmV5DestBeneficiary } from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';
import { V4 } from './v4.js';

export const V5: XcmCreator = {
	createBeneficiary: ({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary => {
		const v4 = V4.createBeneficiary({ accountId, parents });
		return { V5: v4.V4 };
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
		return { V5: beneficiary };
	},

	createXTokensDestBeneficiary: ({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets => {
		const X1 = [{ AccountId32: { id: accountId } }]; // Now in array
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V5: beneficiary } as XcmV5DestBeneficiary;
	},
};
