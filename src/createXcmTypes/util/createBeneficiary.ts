import { XcmCreator, XcmVersionedMultiLocation } from '../types.js';

export const createBeneficiary = (accountId: string, xcmCreator: XcmCreator): XcmVersionedMultiLocation => {
	const parents = 0; // always 0
	return xcmCreator.beneficiary({ accountId, parents });
};

export const createXTokensParachainDestBeneficiary = (
	destChainId: string,
	accountId: string,
	xcmCreator: XcmCreator,
): XcmVersionedMultiLocation => {
	const parents = 1; // always 1
	return xcmCreator.xTokensParachainDestBeneficiary({
		accountId,
		destChainId,
		parents,
	});
};

export const createXTokensDestBeneficiary = (accountId: string, xcmCreator: XcmCreator): XcmVersionedMultiLocation => {
	const parents = 1; // always 1
	return xcmCreator.xTokensDestBeneficiary({ accountId, parents });
};
