import { AnyJson } from '@polkadot/types-codec/types';

import { RemoteReserve } from '../../types.js';
import {
	FungibleAsset,
	FungibleAssetType,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiLocation,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmV4MultiLocation,
	XcmV5DestBeneficiary,
	XcmVersionedAssetId,
} from '../types.js';
import { createParachainDestBeneficiaryInner } from './common.js';
import { V4 } from './v4.js';

export const V5: XcmCreator = {
	xcmVersion: 5,

	// Same as V4
	createBeneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
		const v4 = V4.createBeneficiary({ accountId, parents });
		return { V5: v4.V4 };
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
		return { V5: beneficiary };
	},

	// Same as V4
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
		return { V5: beneficiary } as XcmV5DestBeneficiary;
	},

	// Same as V4
	createMultiAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
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
};
