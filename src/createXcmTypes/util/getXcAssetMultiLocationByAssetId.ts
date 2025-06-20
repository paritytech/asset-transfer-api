// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { Registry } from '../../registry/index.js';
import type { SanitizedXcAssetsData } from '../../registry/types.js';
import { validateNumber } from '../../validate/index.js';
import { getXcmCreator } from '../xcm/index.js';
import { getAssetId } from './getAssetId.js';

export const getXcAssetMultiLocationByAssetId = async (
	api: ApiPromise,
	assetId: string,
	specName: string,
	xcmVersion: number,
	registry: Registry,
): Promise<string> => {
	const xcmCreator = getXcmCreator(xcmVersion);
	// if symbol, get the integer or multilocation assetId
	if (!validateNumber(assetId)) {
		assetId = await getAssetId({
			api,
			registry,
			asset: assetId,
			specName,
			xcmCreator,
		});
	}

	const paraId = registry.lookupChainIdBySpecName(specName);
	const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData as SanitizedXcAssetsData[];

	if (validateNumber(assetId)) {
		for (const info of paraXcAssets) {
			if (typeof info.asset === 'string' && info.asset === assetId) {
				return info.xcmV1MultiLocation;
			}
		}
	} else if (assetId.toLowerCase().includes('parents')) {
		return assetId;
	}

	throw new BaseError(
		`assetId ${assetId} is not a valid symbol or integer asset id for ${specName}`,
		BaseErrorsEnum.InvalidAsset,
	);
};
