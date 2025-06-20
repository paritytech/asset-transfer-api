import { AnyJson } from '@polkadot/types-codec/types';

import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import {
	FungibleAssetType,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV5DestBeneficiary,
} from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';
import { V4 } from './v4.js';

const xcmVersion = 5;

export const V5: XcmCreator = {
	// Same as V4
	createBeneficiary: ({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary => {
		const v4 = V4.createBeneficiary({ accountId, parents });
		return { V5: v4.V4 };
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
		return { V5: beneficiary };
	},

	// Same as V4
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

	// Same as V4
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
