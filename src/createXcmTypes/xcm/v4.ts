import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	FungibleAssetType,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV4DestBeneficiary,
} from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';

const xcmVersion = 4;

export const V4: XcmCreator = {
	createBeneficiary: ({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary => {
		const X1 = isEthereumAddress(accountId)
			? [{ AccountKey20: { key: accountId } }]
			: [{ AccountId32: { id: accountId } }];
		return {
			V4: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
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
		return { V4: beneficiary };
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
		return { V4: beneficiary } as XcmV4DestBeneficiary;
	},

	createMultiAsset: ({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType => {
		// TODO: Remove xcmVersion arg and cleanup
		const concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: amount,
			},
		};
	},
};
