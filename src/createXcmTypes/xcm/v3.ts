import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import {
	FungibleAssetType,
	FungibleMultiAsset,
	XcAssetsMultiAsset,
	XcAssetsMultiLocation,
	XcmCreator,
	XcmMultiAssets,
	XcmMultiLocation,
	XcmMultiLocationForVersion,
	XcmV3MultiLocation,
	XcmVersionedAssetId,
	XcmVersionedMultiLocation,
	XcmVersionKey,
} from '../types.js';
import { createParachainBeneficiary, parseMultiLocation } from './common.js';

export const V3: XcmCreator = {
	xcmVersion: 3,

	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmVersionedMultiLocation {
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
	}): XcmVersionedMultiLocation {
		const beneficiary = createParachainBeneficiary({
			accountId,
			destChainId,
			parents,
		}) as XcmMultiLocationForVersion<XcmVersionKey.V3>;
		return { V3: beneficiary };
	},

	// Same as V2
	xTokensDestBeneficiary({
		accountId,
		parents = 1,
	}: {
		accountId: string;
		parents: number;
	}): XcmVersionedMultiLocation {
		const X1 = { AccountId32: { id: accountId } };
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V3: beneficiary };
	},

	// Same as V2
	fungibleAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
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

	resolveMultiLocation(multiLocation: AnyJson): XcmMultiLocation {
		return parseMultiLocation(multiLocation, this.xcmVersion);
	},

	// Same as V2
	multiAsset(asset: FungibleAssetType): XcAssetsMultiAsset {
		return { V3: asset as FungibleMultiAsset };
	},

	// Same as V2
	multiAssets(assets: FungibleAssetType[]): XcmMultiAssets {
		return { V3: assets as FungibleMultiAsset[] };
	},

	// Same as V2
	multiLocation(multiLocation: XcmMultiLocation): XcAssetsMultiLocation {
		return { V3: { id: { Concrete: multiLocation as XcmV3MultiLocation } } };
	},

	remoteReserve(multiLocation: XcmMultiLocation): RemoteReserve {
		return {
			RemoteReserve: { V3: multiLocation },
		};
	},

	// Same as V2
	versionedAssetId(multiLocation: XcmMultiLocation): XcmVersionedAssetId {
		return { V3: { Concrete: this.resolveMultiLocation(multiLocation) } };
	},

	// Same as V2
	parachainDest({ destId, parents }: { destId: string; parents: number }): XcmVersionedMultiLocation {
		const chainId = Number(destId);
		if (isNaN(chainId)) {
			throw new BaseError(
				'destChainId expected to be string representation of an integer',
				BaseErrorsEnum.InvalidInput,
			);
		}
		const X1 = { Parachain: chainId };
		return {
			V3: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmVersionedMultiLocation {
		return {
			V3: {
				parents,
				interior: { Here: null },
			},
		};
	},

	interiorDest({ destId, parents }: { destId: string; parents: number }): XcmVersionedMultiLocation {
		const multiLocation = this.resolveMultiLocation(destId) as XcmV3MultiLocation;
		if (!multiLocation.interior) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return {
			V3: {
				parents,
				interior: multiLocation.interior,
			},
		};
	},

	// Same as V2
	hereAsset({ amount, parents }: { amount: string; parents: number }): XcmMultiAssets {
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

	// Same across all versions
	xcmMessage(msg: AnyJson): AnyJson {
		return { V3: msg };
	},
};
