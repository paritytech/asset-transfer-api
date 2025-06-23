import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import {
	FungibleAsset,
	FungibleAssetType,
	InteriorKey,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiLocation,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV4JunctionDestBeneficiary,
	XcmV4MultiLocation,
	XcmV5DestBeneficiary,
	XcmVersionedAssetId,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';
import { V4 } from './v4.js';

export const V5: XcmCreator = {
	xcmVersion: 5,

	// Same as V4
	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
		const v4 = V4.beneficiary({ accountId, parents });
		return { V5: v4.V4 };
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
		return { V5: beneficiary };
	},

	// Same as V4
	xTokensDestBeneficiary({
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
		return { V5: beneficiary } as XcmV5DestBeneficiary;
	},

	// Same as V4
	multiAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
		const concreteMultiLocation = this.resolveMultiLocation(multiLocation);
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: amount,
			},
		};
	},

	// Same as V4
	resolveMultiLocation: V4.resolveMultiLocation,

	// Save as V4
	multiAssets(assets: FungibleAssetType[]): UnionXcAssetsMultiAssets {
		return { V4: assets as FungibleAsset[] };
	},

	// Same as V4
	multiLocation(multiLocation: UnionXcmMultiLocation): UnionXcAssetsMultiLocation {
		return { V4: { id: multiLocation as XcmV4MultiLocation } };
	},

	// Same as V3
	remoteReserve(multiLocation: UnionXcmMultiLocation): RemoteReserve {
		return {
			RemoteReserve: { V5: multiLocation },
		};
	},

	// Same as V4
	versionedAssetId(multiLocation: UnionXcmMultiLocation): XcmVersionedAssetId {
		return { V5: this.resolveMultiLocation(multiLocation) };
	},

	// Same as V4
	parachainDest({ destId, parents }: { destId: string; parents: number }): XcmDestBeneficiary {
		const X1 = [{ Parachain: destId }];
		return {
			V5: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmDestBeneficiary {
		return {
			V5: {
				parents,
				interior: { Here: null },
			},
		};
	},

	// Same as V4
	interiorDest({ destId, parents }: { destId: string; parents: number }): XcmDestBeneficiary {
		const multiLocation = parseLocationStrToLocation(destId);

		let interior: InteriorKey | undefined = undefined;
		if (multiLocation && multiLocation.interior.X1) {
			interior = { X1: [multiLocation.interior.X1 as XcmV4JunctionDestBeneficiary] };
		} else {
			interior = { X2: multiLocation.interior.X2 as XcmV4JunctionDestBeneficiary[] };
		}

		if (!interior) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return {
			V5: {
				parents,
				interior,
			},
		};
	},
};
