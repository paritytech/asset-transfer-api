// Copyright 2024 Parity Technologies (UK) Ltd.

import { isEthereumAddress } from '@polkadot/util-crypto';

import { XcmDestBeneficiary } from '../types';

export const createBeneficiary = (accountId: string, xcmVersion?: number): XcmDestBeneficiary => {
	if (xcmVersion === 2) {
		const X1 = isEthereumAddress(accountId)
			? { AccountKey20: { network: 'Any', key: accountId } }
			: { AccountId32: { network: 'Any', id: accountId } };

		return {
			V2: {
				parents: 0,
				interior: {
					X1,
				},
			},
		};
	}

	if (xcmVersion === 3) {
		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };

		return {
			V3: {
				parents: 0,
				interior: {
					X1,
				},
			},
		};
	}

	const X1 = isEthereumAddress(accountId)
		? [{ AccountKey20: { key: accountId } }]
		: [{ AccountId32: { id: accountId } }];

	return {
		V4: {
			parents: 0,
			interior: {
				X1,
			},
		},
	};
};
