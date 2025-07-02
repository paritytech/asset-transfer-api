import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { RemoteReserve } from '../../types.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import {
	FungibleAssetType,
	FungibleMultiAsset,
	XcAssetsMultiAsset,
	XcAssetsMultiLocation,
	XcmBeneficiary,
	XcmCreator,
	XcmDestBeneficiary,
	XcmMultiAssets,
	XcmMultiLocation,
	XcmV2MultiLocation,
	XcmVersionedAssetId,
} from '../types.js';
import { parseLocationStrToLocation } from '../util/parseLocationStrToLocation.js';
import { createParachainDestBeneficiaryInner } from './common.js';

export const V2: XcmCreator = {
	xcmVersion: 2,

	beneficiary({ accountId, parents = 0 }: { accountId: string; parents: number }): XcmDestBeneficiary {
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
	}): XcmBeneficiary {
		const beneficiary = createParachainDestBeneficiaryInner({
			accountId,
			destChainId,
			parents,
		});
		return { V2: beneficiary };
	},

	xTokensDestBeneficiary({ accountId, parents = 1 }: { accountId: string; parents: number }): XcmBeneficiary {
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
			result = result.v1 as XcmMultiLocation;
		}

		return sanitizeKeys(result);
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

	parachainDest({ destId, parents }: { destId: string; parents: number }): XcmDestBeneficiary {
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
	hereDest({ parents }: { parents: number }): XcmDestBeneficiary {
		return {
			V2: {
				parents,
				interior: { Here: null },
			},
		};
	},

	interiorDest(_opts: { destId: string; parents: number }): XcmDestBeneficiary {
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
