import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	FungibleAssetType,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV3DestBeneficiary,
} from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';

const xcmVersion = 3;

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
		return { V3: beneficiary };
	},

	// Same as V2
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

	// Same as V2
	createMultiAsset: ({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType => {
		// TODO: Remove xcmVersion arg and cleanup
		const concreteMultiLocation = resolveMultiLocation(multiLocation, xcmVersion);
		return {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: amount,
			},
		};
	},
};
