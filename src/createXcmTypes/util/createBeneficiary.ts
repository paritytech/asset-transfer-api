// Copyright 2024 Parity Technologies (UK) Ltd.

import { XcmCreator, XcmDestBeneficiary, XcmDestBeneficiaryXcAssets } from '../types.js';

export const createBeneficiary = (accountId: string, xcmCreator: XcmCreator): XcmDestBeneficiary => {
	const parents = 0; // always 0
	return xcmCreator.createBeneficiary({ accountId, parents });
};

export const createXTokensParachainDestBeneficiary = (
	destChainId: string,
	accountId: string,
	xcmCreator: XcmCreator,
): XcmDestBeneficiaryXcAssets => {
	const parents = 1; // always 1
	return xcmCreator.createXTokensParachainDestBeneficiary({
		accountId,
		destChainId,
		parents,
	});
};

export const createXTokensDestBeneficiary = (accountId: string, xcmCreator: XcmCreator): XcmDestBeneficiaryXcAssets => {
	const parents = 1; // always 1
	return xcmCreator.createXTokensDestBeneficiary({ accountId, parents });
};
