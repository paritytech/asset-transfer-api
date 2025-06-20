import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import {
	FungibleAsset,
	FungibleAssetType,
	UnionXcAssetsMultiAssets,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV4DestBeneficiary,
	XcmV4Junction,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';

const xcmVersion = 4;

export const V4: XcmCreator = {
	createBeneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
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
	createXTokensParachainDestBeneficiary({
		accountId,
		destChainId,
		parents = 1,
	}: {
		accountId: string;
		destChainId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets {
		const beneficiary = createParachainDestBeneficiaryInner({
			accountId,
			destChainId,
			parents,
		});
		return { V4: beneficiary };
	},

	createXTokensDestBeneficiary({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets {
		const X1 = [{ AccountId32: { id: accountId } }]; // Now in array
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V4: beneficiary } as XcmV4DestBeneficiary;
	},

	createMultiAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
		// TODO: Remove xcmVersion arg and cleanup
		const concreteMultiLocation = this.resolveMultiLocation(multiLocation);
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: amount,
			},
		};
	},

	resolveMultiLocation(multiLocation: AnyJson): UnionXcmMultiLocation {
		const multiLocationStr = typeof multiLocation === 'string' ? multiLocation : JSON.stringify(multiLocation);

		const hasGlobalConsensus =
			multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');

		let result = parseLocationStrToLocation(multiLocationStr, xcmVersion);

		// handle case where result is an xcmV1Multilocation from the registry
		if (typeof result === 'object' && 'v1' in result) {
			result = result.v1 as UnionXcmMultiLocation;
		}

		const isX1V4Location = multiLocationStr.includes('"X1":[');

		if (typeof result === 'object' && result.interior?.X1 && !isX1V4Location) {
			result = {
				parents: result.parents,
				interior: {
					// TODO: cleanup - V3, V4, V5 Junction's are all the same
					X1: [result.interior.X1 as XcmV4Junction],
				},
			};
		}

		// TODO: Clean up - not sure why we don't always sanitize
		if (!hasGlobalConsensus) {
			return sanitizeKeys(result);
		} else {
			return result;
		}
	},

	createUnionXcAssetsMultiAssets(assets: FungibleAssetType[]): UnionXcAssetsMultiAssets {
		return { V4: assets as FungibleAsset[] };
	},
};
