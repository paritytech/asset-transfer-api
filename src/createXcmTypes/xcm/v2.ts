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
	XcmV2MultiLocation,
	XcmVersionedAssetId,
	XcmVersionedMultiLocation,
	XcmVersionKey,
} from '../types.js';
import { createParachainBeneficiary, parseMultiLocation } from './common.js';

export const V2: XcmCreator = {
	xcmVersion: 2,

	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmVersionedMultiLocation {
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
		}) as XcmMultiLocationForVersion<XcmVersionKey.V2>;
		return { V2: beneficiary };
	},

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
		return { V2: beneficiary };
	},

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

	multiAsset(asset: FungibleAssetType): XcAssetsMultiAsset {
		return { V2: asset as FungibleMultiAsset };
	},

	multiAssets(assets: FungibleAssetType[]): XcmMultiAssets {
		return { V2: assets as FungibleMultiAsset[] };
	},

	multiLocation(multiLocation: XcmMultiLocation): XcAssetsMultiLocation {
		return { V2: { id: { Concrete: multiLocation as XcmV2MultiLocation } } };
	},

	remoteReserve(_multiLocation: XcmMultiLocation): RemoteReserve {
		throw new BaseError('XcmVersion must be greater than 2 for RemoteReserve.', BaseErrorsEnum.InvalidXcmVersion);
	},

	versionedAssetId(multiLocation: XcmMultiLocation): XcmVersionedAssetId {
		return { V2: { Concrete: this.resolveMultiLocation(multiLocation) } };
	},

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
			V2: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmVersionedMultiLocation {
		return {
			V2: {
				parents,
				interior: { Here: null },
			},
		};
	},

	interiorDest(_opts: { destId: string; parents: number }): XcmVersionedMultiLocation {
		throw new BaseError('XcmVersion not supported.', BaseErrorsEnum.InvalidXcmVersion);
	},

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

		return { V2: multiAssets as FungibleMultiAsset[] };
	},

	// Same across all versions
	xcmMessage(msg: AnyJson): AnyJson {
		return { V2: msg };
	},
};
