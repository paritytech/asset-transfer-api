// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../errors';
// import type { Registry } from '../registry';
import { getFeeAssetItemIndex } from '../util/getFeeAssetItemIndex';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
// import { validateNumber } from '../validate';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	ICreateXcmType,
	UnionXcmMultiAssets,
	// UnionXcmMultiLocation,
	XcmDestBeneficiary,
	XcmV4JunctionDestBeneficiary,
	XcmWeight,
} from './types';
import { dedupeAssets } from './util/dedupeAssets';
// import { fetchPalletInstanceId } from './util/fetchPalletInstanceId';
// import { getAssetId } from './util/getAssetId';
// import { isRelayNativeAsset } from './util/isRelayNativeAsset';
import { isSystemChain } from './util/isSystemChain';
import { sortAssetsAscending } from './util/sortAssetsAscending';
import { isEthereumAddress } from '@polkadot/util-crypto';
// import { assetDestIsBridge } from './util/assetDestIsBridge';
import { getGlobalConsensusDestFromAssetLocation } from './util/getGlobalConsensusDestFromAssetLocation';

export const SystemToBridge: ICreateXcmType = {
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
	createDest: (_: string, xcmVersion: number, assetIds?: string[]): XcmDestBeneficiary => {
		if (!assetIds) {
			throw new BaseError(`assetId arg must provided for Bridge transactions`);
		}

		const destination = getGlobalConsensusDestFromAssetLocation(assetIds[0], xcmVersion);		

		if (xcmVersion === 3) {
			/**
			 * Ensure that the `parents` field is a `1` when sending a destination MultiLocation
			 * from a system parachain to a sovereign parachain.
			 */
			return {
				V3: {
					parents: 2,
					interior: {
						X1: destination,
					},
				},
			};
		}

		const X1 = [destination as XcmV4JunctionDestBeneficiary];

		return {
			V4: {
				parents: 2,
				interior: {
					X1,
				},
			},
		};
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
		_specName: string,
		assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> => {
		// const { registry, isForeignAssetsTransfer, isLiquidTokenTransfer, api } = opts;

		const sortedAndDedupedMultiAssets = await createSystemToBridgeAssets(
			// api,
			amounts,
			// specName,
			assets,
			// registry,
			xcmVersion,
			// isForeignAssetsTransfer,
			// isLiquidTokenTransfer,
		);

		if (xcmVersion === 3) {
			return Promise.resolve({
				V3: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[],
			});
		} else {
			return Promise.resolve({
				V4: sortedAndDedupedMultiAssets as FungibleStrAsset[],
			});
		}
	},
	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit: (opts: CreateWeightLimitOpts): XcmWeight => {
		return opts.isLimited && opts.weightLimit?.refTime && opts.weightLimit?.proofSize
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
	createFeeAssetItem: async (api: ApiPromise, opts: CreateFeeAssetItemOpts): Promise<number> => {
		const {
			registry,
			paysWithFeeDest,
			specName,
			assetIds,
			amounts,
			xcmVersion,
			// isForeignAssetsTransfer,
			// isLiquidTokenTransfer,
		} = opts;
		if (xcmVersion && xcmVersion === 3 && specName && amounts && assetIds && paysWithFeeDest) {
			const multiAssets = await createSystemToBridgeAssets(
				// api,
				normalizeArrToStr(amounts),
				// specName,
				assetIds,
				// registry,
				xcmVersion,
				// isForeignAssetsTransfer,
				// isLiquidTokenTransfer,
			);

			const systemChainId = registry.lookupChainIdBySpecName(specName);

			if (!isSystemChain(systemChainId)) {
				throw new BaseError(
					`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
					BaseErrorsEnum.InternalError,
				);
			}

			const assetIndex = getFeeAssetItemIndex(
				api,
				registry,
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmVersion,
				opts.isForeignAssetsTransfer,
			);

			return assetIndex;
		}

		return 0;
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
 * @param isLiquidTokenTransfer Whether this transfer is a liquid pool assets transfer.
 */
export const createSystemToBridgeAssets = async (
	// api: ApiPromise,
	amounts: string[],
	// specName: string,
	assets: string[],
	// registry: Registry,
	xcmVersion: number,
	// isForeignAssetsTransfer: boolean,
	// isLiquidTokenTransfer: boolean,
): Promise<FungibleStrAssetType[]> => {
	let multiAssets: FungibleStrAssetType[] = [];
	let multiAsset: FungibleStrAssetType;
	// const bridgeChainId = registry.lookupChainIdBySpecName(specName);

	// if (!assetDestIsBridge(assets)) {
	// 	throw new BaseError(
	// 		`specName ${specName} did not match a valid Ethereum chain ID. Found ID ${bridgeChainId}`,
	// 		BaseErrorsEnum.InternalError,
	// 	);
	// }

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		let assetLocation = resolveMultiLocation(assetId, xcmVersion);
		console.log('CONCRETE MULTILOCATION', assetLocation);

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
