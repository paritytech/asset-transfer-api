// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { Registry } from '../../registry/index.js';
import { RequireOnlyOne } from '../../types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { validateNumber } from '../../validate/index.js';
import {
	FungibleAsset,
	FungibleAssetType,
	FungibleMultiAsset,
	UnionXcmMultiAssets,
	UnionXcmMultiLocation,
	XcmCreator,
	XcmV2Junctions,
	XcmV3Junctions,
	XcmV4Junctions,
} from '../types.js';
import { dedupeAssets } from './dedupeAssets.js';
import { fetchPalletInstanceId } from './fetchPalletInstanceId.js';
import { getAssetId } from './getAssetId.js';
import { isRelayNativeAsset } from './isRelayNativeAsset.js';
import { sortAssetsAscending } from './sortAssetsAscending.js';

export const createAssetLocations = async (
	api: ApiPromise,
	assetIds: string[],
	specName: string,
	amounts: string[],
	xcmVersion: number = DEFAULT_XCM_VERSION,
	registry: Registry,
	originChainId: string,
	assetIdsContainLocations: boolean,
	isLiquidTokenTransfer: boolean,
	xcmCreator: XcmCreator,
): Promise<UnionXcmMultiAssets> => {
	let multiAssets: FungibleAssetType[] = [];

	const isRelayChain = originChainId === '0' ? true : false;

	for (let i = 0; i < assetIds.length; i++) {
		let multiLocation: UnionXcmMultiLocation;
		const amount = amounts[i];
		let assetId = assetIds[i];

		const palletId = fetchPalletInstanceId(api, assetId, isLiquidTokenTransfer, assetIdsContainLocations);

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(registry, assetId);

		if (!assetIdsContainLocations && !isRelayNative && !isValidInt) {
			assetId = await getAssetId(api, registry, assetId, specName, xcmVersion, assetIdsContainLocations);
		}

		if (assetIdsContainLocations) {
			multiLocation = resolveMultiLocation(assetId, xcmVersion);
		} else {
			const parents = isRelayNative && !isRelayChain ? 1 : 0;
			const interior: RequireOnlyOne<XcmV4Junctions | XcmV3Junctions | XcmV2Junctions> = isRelayNative
				? { Here: '' }
				: {
						X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
					};

			multiLocation = {
				parents,
				interior,
			};
		}
		const multiAsset = xcmCreator.createMultiAsset({
			amount,
			multiLocation,
		});

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets);
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets);

	switch (xcmVersion) {
		case 2:
			return { V2: sortedAndDedupedMultiAssets as FungibleMultiAsset[] };
		case 3:
			return { V3: sortedAndDedupedMultiAssets as FungibleMultiAsset[] };
		case 4:
			return { V4: sortedAndDedupedMultiAssets as FungibleAsset[] };
		case 5:
			return { V5: sortedAndDedupedMultiAssets as FungibleAsset[] };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
