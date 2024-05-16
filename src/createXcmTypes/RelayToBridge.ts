// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../errors';
import type { Registry } from '../registry';
import { RequireOnlyOne } from '../types';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
import { validateNumber } from '../validate';
import {
	CreateWeightLimitOpts,
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	InteriorValue,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmDestBeneficiary,
	XcmV2Junctions,
	XcmV3Junctions,
	XcmV4JunctionDestBeneficiary,
	XcmV4Junctions,
	XcmWeight,
} from './types';
import { dedupeAssets } from './util/dedupeAssets';
import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
import { getAssetId } from './util/getAssetId';
import { getGlobalConsensusDestFromLocation } from './util/getGlobalConsensusDestFromLocation';
import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { sortAssetsAscending } from './util/sortAssetsAscending';

export const RelayToBridge: ICreateXcmType = {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary: (accountId: string, xcmVersion?: number): XcmDestBeneficiary => {
		if (xcmVersion === 3) {
			const X1 = isEthereumAddress(accountId)
				? { AccountKey20: { key: accountId } }
				: { AccountId32: { id: accountId } };

			return {
				V3: {
					parents: 0,
					interior: {
						X1,
					},
				},
			};
		}

		const X1 = isEthereumAddress(accountId)
			? [{ AccountKey20: { key: accountId } }]
			: [{ AccountId32: { id: accountId } }];

		return {
			V4: {
				parents: 0,
				interior: {
					X1,
				},
			},
		};
	},
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest: (destId: string, xcmVersion: number): XcmDestBeneficiary => {
		const destination = getGlobalConsensusDestFromLocation(destId);
		let dest: XcmDestBeneficiary | undefined = undefined;

		if (xcmVersion === 3) {
			dest =
				destination.interior && destination.interior.X1
					? {
							V3: {
								parents: 2,
								interior: {
									X1: destination.interior.X1 as InteriorValue,
								},
							},
					  }
					: {
							V3: {
								parents: 2,
								interior: {
									X2: destination.interior.X2 as InteriorValue,
								},
							},
					  };
		} else {
			if (destination.interior && destination.interior.X1) {
				dest = {
					V4: {
						parents: 2,
						interior: {
							X1: [destination.interior.X1 as XcmV4JunctionDestBeneficiary],
						},
					},
				};
			} else if (destination.interior && destination.interior.X2) {
				dest = {
					V4: {
						parents: 2,
						interior: {
							X2: destination.interior.X2 as XcmV4JunctionDestBeneficiary[],
						},
					},
				};
			}
		}

		if (!dest) {
			throw new BaseError('Unable to create XCM Destination location', BaseErrorsEnum.InternalError);
		}

		return dest;
	},
	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 * @param specName The specname of the chain the api is connected to.
	 * @param assets The assets to create into xcm `MultiAssets`.
	 * @param opts Options regarding the registry, and types of asset transfers.
	 */
	createAssets: async (
		amounts: string[],
		xcmVersion: number,
	): Promise<UnionXcmMultiAssets> => {
        const multiAssets = [];
		let multiAsset: FungibleStrAssetType;

		const amount = amounts[0];
		if (xcmVersion < 4) {
			multiAsset = {
				fun: {
					Fungible: amount,
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			};
		} else {
			multiAsset = {
				fun: {
					Fungible: amount,
				},
				id: {
					interior: {
						Here: '',
					},
					parents: 0,
				},
			};
		}

		multiAssets.push(multiAsset);


        if (xcmVersion === 3) {
            return Promise.resolve({
                V3: multiAssets as FungibleStrMultiAsset[],
            });
        } else {
            return Promise.resolve({
                V4: multiAssets as FungibleStrAsset[],
            });
        }
	},
	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit: (opts: CreateWeightLimitOpts): XcmWeight => {
		return opts.weightLimit?.refTime && opts.weightLimit?.proofSize
			? {
					Limited: {
						refTime: opts.weightLimit?.refTime,
						proofSize: opts.weightLimit?.proofSize,
					},
			  }
			: { Unlimited: null };
	},
	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 * @param opts Options that are used for fee asset construction.
	 */
	createFeeAssetItem: async (_: ApiPromise): Promise<number> => {
        return await Promise.resolve(0);
	},
};

/**
 * Create multiassets for SystemToBridge direction.
 *
 * @param api ApiPromise
 * @param amounts Amount per asset. It will match the `assets` length.
 * @param specName The specname of the chain the api is connected to.
 * @param assets The assets to create into xcm `MultiAssets`.
 * @param xcmVersion The accepted xcm version.
 * @param registry The asset registry used to construct MultiLocations.
 * @param isForeignAssetsTransfer Whether this transfer is a foreign assets transfer.
 */
export const createSystemToBridgeAssets = async (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[],
	registry: Registry,
	xcmVersion: number,
	isForeignAssetsTransfer: boolean,
	isLiquidTokenTransfer: boolean,
): Promise<FungibleStrAssetType[]> => {
	let multiAssets: FungibleStrAssetType[] = [];
	let multiAsset: FungibleStrAssetType;
	const palletId = fetchPalletInstanceId(api, isLiquidTokenTransfer, isForeignAssetsTransfer);
	const systemChainId = registry.lookupChainIdBySpecName(specName);

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const { tokens } = registry.currentRelayRegistry[systemChainId];

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);
		if (!isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, isForeignAssetsTransfer);
		}

		let assetLocation: UnionXcmMultiLocation;

		if (isForeignAssetsTransfer) {
			assetLocation = resolveMultiLocation(assetId, xcmVersion);
		} else {
			const parents = isRelayNative ? 1 : 0;
			const interior: RequireOnlyOne<XcmV4Junctions | XcmV3Junctions | XcmV2Junctions> = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
				  };

			assetLocation = {
				parents,
				interior,
			};
		}

		if (xcmVersion < 4) {
			multiAsset = {
				id: {
					Concrete: assetLocation,
				},
				fun: {
					Fungible: amount,
				},
			};
		} else {
			multiAsset = {
				id: assetLocation,
				fun: {
					Fungible: amount,
				},
			};
		}

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleStrAssetType[];

	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleStrAssetType[];

	return sortedAndDedupedMultiAssets;
};
