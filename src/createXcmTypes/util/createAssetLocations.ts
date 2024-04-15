// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { Registry } from '../../registry';
import { RequireOnlyOne } from '../../types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import { validateNumber } from '../../validate';
import {
	FungibleStrAsset,
	FungibleStrAssetType,
	FungibleStrMultiAsset,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmV2Junctions,
	XcmV3Junctions,
	XcmV4Junctions,
} from '../types';
import { dedupeAssets } from './dedupeAssets';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';
import { getAssetId } from './getAssetId';
import { isRelayNativeAsset } from './isRelayNativeAsset';
import { sortAssetsAscending } from './sortAssetsAscending';

export const createAssetLocations = async (
	api: ApiPromise,
	assetIds: string[],
	specName: string,
	amounts: string[],
	xcmVersion: number,
	registry: Registry,
	originChainId: string,
	assetIdsContainLocations: boolean,
	isLiquidTokenTransfer: boolean,
): Promise<UnionXcmMultiAssets> => {
	let multiAssets: FungibleStrAssetType[] = [];
	let multiAsset: FungibleStrAssetType;

	const { tokens } = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];
	const palletId = fetchPalletInstanceId(api, isLiquidTokenTransfer, assetIdsContainLocations);
	const isRelayChain = originChainId === '0' ? true : false;

	for (let i = 0; i < assetIds.length; i++) {
		let concreteMultiLocation: UnionXcmMultiLocation;
		const amount = amounts[i];
		let assetId = assetIds[i];

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!assetIdsContainLocations && !isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, assetIdsContainLocations);
		}

		if (assetIdsContainLocations) {
			concreteMultiLocation = resolveMultiLocation(assetId, xcmVersion);
		} else {
			const parents = isRelayNative && !isRelayChain ? 1 : 0;
			const interior: RequireOnlyOne<XcmV4Junctions | XcmV3Junctions | XcmV2Junctions> = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
				  };

			concreteMultiLocation = {
				parents,
				interior,
			};
		}

		if (xcmVersion < 4) {
			multiAsset = {
				id: {
					Concrete: concreteMultiLocation,
				},
				fun: {
					Fungible: amount,
				},
			};
		} else {
			multiAsset = {
				id: concreteMultiLocation,
				fun: {
					Fungible: amount,
				},
			};
		}

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets) as FungibleStrAssetType[];
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets) as FungibleStrAssetType[];
	if (xcmVersion === 2) {
		return Promise.resolve({
			V2: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[],
		});
	} else if (xcmVersion === 3) {
		return Promise.resolve({
			V3: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[],
		});
	} else {
		return Promise.resolve({
			V4: sortedAndDedupedMultiAssets as FungibleStrAsset[],
		});
	}
};
