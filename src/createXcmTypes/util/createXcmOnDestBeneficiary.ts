import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { XcmMultiLocation } from '../types.js';

export const createXcmOnDestBeneficiary = (accountId: string, xcmVersion: number): XcmMultiLocation => {
	if (xcmVersion < 3) {
		throw new BaseError(
			'createXcmOnDestBeneficiary: XcmVersion must be greater than 2',
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}

	if (xcmVersion === 3) {
		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };

		return {
			parents: 0,
			interior: {
				X1,
			},
		} as XcmMultiLocation;
	}

	const X1 = isEthereumAddress(accountId)
		? [{ AccountKey20: { key: accountId } }]
		: [{ AccountId32: { id: accountId } }];

	return {
		parents: 0,
		interior: {
			X1,
		},
	} as XcmMultiLocation;
};
