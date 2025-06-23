import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import {
	FungibleAssetType,
	FungibleMultiAsset,
	InteriorKey,
	InteriorValue,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiLocation,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV3DestBeneficiary,
	XcmV3MultiLocation,
	XcmVersionedAssetId,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V3: XcmCreator = {
	xcmVersion: 3,

	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
		const X1 = isEthereumAddress(accountId) ? { AccountKey20: { key: accountId } } : { AccountId32: { id: accountId } };
		return {
			V3: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	xTokensParachainDestBeneficiary({
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
		return { V3: beneficiary };
	},

	// Same as V2
	xTokensDestBeneficiary({
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
		return { V3: beneficiary } as XcmV3DestBeneficiary;
	},

	// Same as V2
	multiAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
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

		const hasGlobalConsensus =
			multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');

		let result = parseLocationStrToLocation(multiLocationStr, this.xcmVersion);

		// handle case where result is an xcmV1Multilocation from the registry
		if (typeof result === 'object' && 'v1' in result) {
			result = result.v1 as UnionXcmMultiLocation;
		}

		// TODO: Clean up - not sure why we don't always sanitize
		if (!hasGlobalConsensus) {
			return sanitizeKeys(result);
		} else {
			return result;
		}
	},

	// Same as V2
	multiAssets(assets: FungibleAssetType[]): UnionXcAssetsMultiAssets {
		return { V3: assets as FungibleMultiAsset[] };
	},

	// Same as V2
	multiLocation(multiLocation: UnionXcmMultiLocation): UnionXcAssetsMultiLocation {
		return { V3: { id: { Concrete: multiLocation as XcmV3MultiLocation } } };
	},

	remoteReserve(multiLocation: UnionXcmMultiLocation): RemoteReserve {
		return {
			RemoteReserve: { V3: multiLocation },
		};
	},

	// Same as V2
	versionedAssetId(multiLocation: UnionXcmMultiLocation): XcmVersionedAssetId {
		return { V3: { Concrete: this.resolveMultiLocation(multiLocation) } };
	},

	// Same as V2
	parachainDest({ destId, parents }: { destId: string; parents: number }): XcmDestBeneficiary {
		const X1 = { Parachain: destId };
		return {
			V3: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmDestBeneficiary {
		return {
			V3: {
				parents,
				interior: { Here: null },
			},
		};
	},

	interiorDest({ destId, parents }: { destId: string; parents: number }): XcmDestBeneficiary {
		const multiLocation = parseLocationStrToLocation(destId);

		let interior: InteriorKey | undefined = undefined;
		if (multiLocation && multiLocation.interior.X1) {
			interior = { X1: multiLocation.interior.X1 as InteriorValue };
		} else {
			interior = { X2: multiLocation.interior.X2 as InteriorValue };
		}

		if (!interior) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return {
			V3: {
				parents,
				interior,
			},
		};
	},

	// Same as V2
	hereAsset({ amount, parents }: { amount: string; parents: number }): UnionXcmMultiAssets {
		const multiAssets: FungibleAssetType[] = [];
		const multiAsset: FungibleAssetType = {
			fun: {
				Fungible: amount,
			},
			id: {
				Concrete: {
					interior: { Here: '' },
					parents,
				},
			},
		};
		multiAssets.push(multiAsset);

		return { V3: multiAssets as FungibleMultiAsset[] };
	},
};
