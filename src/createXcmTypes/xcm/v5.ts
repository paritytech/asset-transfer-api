import { AnyJson } from '@polkadot/types-codec/types';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import {
	FungibleAsset,
	FungibleAssetType,
	XcAssetsMultiAsset,
	XcAssetsMultiLocation,
	XcmCreator,
	XcmJunction,
	XcmMultiAssets,
	XcmMultiLocation,
	XcmMultiLocationForVersion,
	XcmV5MultiLocation,
	XcmVersionedAssetId,
	XcmVersionedMultiLocation,
	XcmVersionKey,
} from '../types.js';
import { createParachainBeneficiary } from './common.js';
import { V4 } from './v4.js';

export const V5: XcmCreator = {
	xcmVersion: 5,

	// Same as V4
	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmVersionedMultiLocation {
		const v4 = V4.beneficiary({ accountId, parents }) as { V4: XcmMultiLocationForVersion<XcmVersionKey.V4> };
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
	}): XcmVersionedMultiLocation {
		const beneficiary = createParachainBeneficiary({
			accountId,
			destChainId,
			parents,
		}) as XcmMultiLocationForVersion<XcmVersionKey.V5>;
		return { V5: beneficiary };
	},

	// Same as V4
	xTokensDestBeneficiary({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmVersionedMultiLocation {
		const X1 = [{ AccountId32: { id: accountId } }] as [{ AccountId32: { id: string } }];
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V5: beneficiary };
	},

	// Same as V4
	fungibleAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
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

	// Same as V4
	multiAsset(asset: FungibleAssetType): XcAssetsMultiAsset {
		return { V5: asset as FungibleAsset };
	},

	// Save as V4
	multiAssets(assets: FungibleAssetType[]): XcmMultiAssets {
		return { V5: assets as FungibleAsset[] };
	},

	// Same as V4
	multiLocation(multiLocation: XcmMultiLocation): XcAssetsMultiLocation {
		return { V5: { id: multiLocation as XcmV5MultiLocation } };
	},

	// Same as V3
	remoteReserve(multiLocation: XcmMultiLocation): RemoteReserve {
		return {
			RemoteReserve: { V5: multiLocation },
		};
	},

	// Same as V4
	versionedAssetId(multiLocation: XcmMultiLocation): XcmVersionedAssetId {
		return { V5: this.resolveMultiLocation(multiLocation) };
	},

	// Same as V4
	parachainDest({ destId, parents }: { destId: string; parents: number }): XcmVersionedMultiLocation {
		const chainId = Number(destId);
		if (isNaN(chainId)) {
			throw new BaseError(
				'destChainId expected to be string representation of an integer',
				BaseErrorsEnum.InvalidInput,
			);
		}
		const X1 = [{ Parachain: chainId }] as [XcmJunction];
		return {
			V5: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmVersionedMultiLocation {
		return {
			V5: {
				parents,
				interior: { Here: null },
			},
		};
	},

	// Same as V4
	interiorDest({ destId, parents }: { destId: string; parents: number }): XcmVersionedMultiLocation {
		const multiLocation = this.resolveMultiLocation(destId) as XcmV5MultiLocation;

		if (!multiLocation.interior) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return {
			V5: {
				parents,
				interior: multiLocation.interior,
			},
		};
	},

	// Same as V4
	hereAsset({ amount, parents }: { amount: string; parents: number }): XcmMultiAssets {
		const multiAssets: FungibleAssetType[] = [];
		const multiAsset: FungibleAssetType = {
			fun: {
				Fungible: amount,
			},
			id: {
				interior: { Here: '' },
				parents,
			},
		};
		multiAssets.push(multiAsset);

		return { V5: multiAssets as FungibleAsset[] };
	},

	// Same across all versions
	xcmMessage(msg: AnyJson): AnyJson {
		return { V5: msg };
	},
};
