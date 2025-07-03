import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import {
	FungibleAsset,
	FungibleAssetType,
	XcAssetsMultiAsset,
	XcAssetsMultiLocation,
	XcmBeneficiary,
	XcmCreator,
	XcmJunction,
	XcmMultiAssets,
	XcmMultiLocation,
	XcmV4MultiLocation,
	XcmVersionedAssetId,
	XcmVersionedMultiLocation,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V4: XcmCreator = {
	xcmVersion: 4,

	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmVersionedMultiLocation {
		const X1 = isEthereumAddress(accountId)
			? ([{ AccountKey20: { key: accountId } }] as [XcmJunction])
			: ([{ AccountId32: { id: accountId } }] as [XcmJunction]);
		return {
			V4: {
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
	}): XcmBeneficiary {
		const beneficiary = createParachainDestBeneficiaryInner({
			accountId,
			destChainId,
			parents,
		});
		return { V4: beneficiary };
	},

	xTokensDestBeneficiary({ accountId, parents = 1 }: { accountId: string; parents: number }): XcmBeneficiary {
		const X1 = [{ AccountId32: { id: accountId } }] as [{ AccountId32: { id: string } }];
		const beneficiary = {
			parents,
			interior: { X1 },
		};
		return { V4: beneficiary };
	},

	fungibleAsset({ amount, multiLocation }: { amount: string; multiLocation: AnyJson }): FungibleAssetType {
		const concreteMultiLocation = this.resolveMultiLocation(multiLocation);
		return {
			id: concreteMultiLocation,
			fun: {
				Fungible: amount,
			},
		};
	},

	resolveMultiLocation(multiLocation: AnyJson): XcmMultiLocation {
		const multiLocationStr = typeof multiLocation === 'string' ? multiLocation : JSON.stringify(multiLocation);

		let result = parseLocationStrToLocation(multiLocationStr, this.xcmVersion);

		// handle case where result is an xcmV1Multilocation from the registry
		if (typeof result === 'object' && 'v1' in result) {
			result = result.v1 as XcmMultiLocation;
		}

		const isX1V4Location = multiLocationStr.includes('"X1":[');

		if (typeof result === 'object' && result.interior?.X1 && !isX1V4Location) {
			result = {
				parents: result.parents,
				interior: {
					X1: result.interior.X1 as XcmJunction,
				},
			};
		}

		return sanitizeKeys(result);
	},

	multiAsset(asset: FungibleAssetType): XcAssetsMultiAsset {
		return { V4: asset as FungibleAsset };
	},

	multiAssets(assets: FungibleAssetType[]): XcmMultiAssets {
		return { V4: assets as FungibleAsset[] };
	},

	multiLocation(multiLocation: XcmMultiLocation): XcAssetsMultiLocation {
		return { V4: { id: multiLocation as XcmV4MultiLocation } };
	},

	// Same as V3
	remoteReserve(multiLocation: XcmMultiLocation): RemoteReserve {
		return {
			RemoteReserve: { V4: multiLocation },
		};
	},

	versionedAssetId(multiLocation: XcmMultiLocation): XcmVersionedAssetId {
		return { V4: this.resolveMultiLocation(multiLocation) };
	},

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
			V4: {
				parents,
				interior: { X1 },
			},
		};
	},

	// Same across all versions
	hereDest({ parents }: { parents: number }): XcmVersionedMultiLocation {
		return {
			V4: {
				parents,
				interior: { Here: null },
			},
		};
	},

	interiorDest({ destId, parents }: { destId: string; parents: number }): XcmVersionedMultiLocation {
		const multiLocation = parseLocationStrToLocation(destId, this.xcmVersion) as XcmV4MultiLocation;

		return {
			V4: {
				parents,
				interior: multiLocation.interior,
			},
		};
	},

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

		return { V4: multiAssets as FungibleAsset[] };
	},

	// Same across all versions
	xcmMessage(msg: AnyJson): AnyJson {
		return { V4: msg };
	},
};
