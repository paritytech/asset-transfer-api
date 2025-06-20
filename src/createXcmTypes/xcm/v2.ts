import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import {
	FungibleAssetType,
	FungibleMultiAsset,
	UnionXcAssetsMultiAssets,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV2DestBeneficiary,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V2: XcmCreator = {
	xcmVersion: 2,

	createBeneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
		const X1 = isEthereumAddress(accountId)
			? { AccountKey20: { network: 'Any', key: accountId } }
			: { AccountId32: { network: 'Any', id: accountId } };
		return {
			V2: {
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
		return { V2: beneficiary };
	},

	createXTokensDestBeneficiary({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmDestBeneficiaryXcAssets {
		const X1 = { AccountId32: { id: accountId } };
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V2: beneficiary } as XcmV2DestBeneficiary;
	},

	createMultiAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
		const concreteMultiLocation = this.resolveMultiLocation(multiLocation);
		return {
			id: {
				Concrete: concreteMultiLocation,
			},
			fun: {
				Fungible: amount,
			},
		};
	},

	resolveMultiLocation(multiLocation: AnyJson): UnionXcmMultiLocation {
		const multiLocationStr = typeof multiLocation === 'string' ? multiLocation : JSON.stringify(multiLocation);

		// Ensure we check this first since the main difference between v2, and later versions is the `globalConsensus` junction
		const hasGlobalConsensus =
			multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');

		if (hasGlobalConsensus) {
			throw new BaseError(
				'XcmVersion must be greater than 2 for MultiLocations that contain a GlobalConsensus junction.',
				BaseErrorsEnum.InvalidXcmVersion,
			);
		}

		let result = parseLocationStrToLocation(multiLocationStr, this.xcmVersion);

		// handle case where result is an xcmV1Multilocation from the registry
		if (typeof result === 'object' && 'v1' in result) {
			result = result.v1 as UnionXcmMultiLocation;
		}

		return sanitizeKeys(result);
	},

	createUnionXcAssetsMultiAssets(assets: FungibleAssetType[]): UnionXcAssetsMultiAssets {
		return { V2: assets as FungibleMultiAsset[] };
	},
};
