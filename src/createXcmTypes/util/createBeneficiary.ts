// Copyright 2024 Parity Technologies (UK) Ltd.

import { isEthereumAddress } from '@polkadot/util-crypto';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import {
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV2DestBeneficiary,
	XcmV2ParachainDestBeneficiary,
	XcmV3DestBeneficiary,
	XcmV3ParachainDestBeneficiary,
	XcmV4DestBeneficiary,
	XcmV4ParachainDestBeneficiary,
	XcmV5DestBeneficiary,
	XcmV5ParachainDestBeneficiary,
} from '../types.js';

export const createBeneficiary = (accountId: string, xcmVersion: number = DEFAULT_XCM_VERSION): XcmDestBeneficiary => {
	const versionKey = `V${xcmVersion}`;
	const parents = 0; // always 0
	const beneficiary = {
		[versionKey]: {
			parents,
			interior: {}, // dependent on verison
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

export const createXTokensParachainDestBeneficiary = (
	destChainId: string,
	accountId: string,
	xcmVersion: number = DEFAULT_XCM_VERSION,
): XcmDestBeneficiaryXcAssets => {
	const parents = 1; // always 1
	const X2 = isEthereumAddress(accountId)
		? [{ Parachain: destChainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: destChainId }, { AccountId32: { id: accountId } }];
	const beneficiary = {
		parents,
		interior: { X2 },
	};
	switch (xcmVersion) {
		case 2:
			return { V2: beneficiary } as XcmV2ParachainDestBeneficiary;
		case 3:
			return { V3: beneficiary } as XcmV3ParachainDestBeneficiary;
		case 4:
			return { V4: beneficiary } as XcmV4ParachainDestBeneficiary;
		case 5:
			return { V5: beneficiary } as XcmV5ParachainDestBeneficiary;
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};

export const createXTokensDestBeneficiary = (
	accountId: string,
	xcmVersion: number = DEFAULT_XCM_VERSION,
): XcmDestBeneficiaryXcAssets => {
	const parents = 1; // always 1
	let X1 = {};
	if ([2, 3].includes(xcmVersion)) {
		X1 = { AccountId32: { id: accountId } };
	} else {
		X1 = [{ AccountId32: { id: accountId } }];
	}
	const beneficiary = {
		parents,
		interior: { X1 },
	};
	switch (xcmVersion) {
		case 2:
			return { V2: beneficiary } as XcmV2DestBeneficiary;
		case 3:
			return { V3: beneficiary } as XcmV3DestBeneficiary;
		case 4:
			return { V4: beneficiary } as XcmV4DestBeneficiary;
		case 5:
			return { V5: beneficiary } as XcmV5DestBeneficiary;
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
