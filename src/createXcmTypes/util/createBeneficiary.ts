// Copyright 2024 Parity Technologies (UK) Ltd.

import { isEthereumAddress } from '@polkadot/util-crypto';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { XcmDestBeneficiary } from '../types.js';

export const createBeneficiary = (accountId: string, xcmVersion: number = DEFAULT_XCM_VERSION): XcmDestBeneficiary => {
	const versionKey = `v${xcmVersion}`;
	const beneficiary = {
		[versionKey]: {
			parents: 0,
			interior: {}, // depedant on verison
		},
	};
	if (xcmVersion == 2) {
		const X1 = isEthereumAddress(accountId)
			? { AccountKey20: { network: 'Any', key: accountId } }
			: { AccountId32: { network: 'Any', id: accountId } };
		beneficiary[versionKey].interior = {
			X1,
		};
	} else if (xcmVersion == 3) {
		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };
		beneficiary[versionKey].interior = {
			X1,
		};
	} else if ([4, 5].includes(xcmVersion)) {
		const X1 = isEthereumAddress(accountId)
			? [{ AccountKey20: { key: accountId } }]
			: [{ AccountId32: { id: accountId } }];
		beneficiary[versionKey].interior = {
			X1,
		};
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
	return beneficiary;
};
