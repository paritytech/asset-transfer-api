import { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { Registry } from '../../registry/Registry.js';
import {
	type CreateAssetsOpts,
	type FungibleStrAsset,
	type FungibleStrAssetType,
	type FungibleStrMultiAsset,
	intToXcmVersionKey,
	type UnionXcmMultiAssets,
	type XcmVersionKey,
} from '../types.js';

type XcmAssetArrayMap = {
	[XcmVersionKey.V2]: FungibleStrMultiAsset[];
	[XcmVersionKey.V3]: FungibleStrMultiAsset[];
	[XcmVersionKey.V4]: FungibleStrAsset[];
	[XcmVersionKey.V5]: FungibleStrAsset[];
};

export const createAssets = async ({
	amounts,
	specName,
	assets,
	opts,
	multiAssetCreator,
	xcmVersion = DEFAULT_XCM_VERSION,
}: {
	amounts: string[];
	specName: string;
	assets: string[];
	opts: CreateAssetsOpts;
	multiAssetCreator: (params: {
		api: ApiPromise;
		amounts: string[];
		specName: string;
		assets: string[];
		xcmVersion: number;
		registry: Registry;
		destChainId?: string;
	}) => Promise<FungibleStrAssetType[]>;
	xcmVersion: number;
}): Promise<UnionXcmMultiAssets> => {
	const versionKey = intToXcmVersionKey(xcmVersion);

	const sortedAndDedupedMultiAssets = await multiAssetCreator({
		api: opts.api,
		amounts,
		specName,
		assets,
		xcmVersion,
		registry: opts.registry,
		destChainId: opts.destChainId,
	});

	const xcmAssetFactories: {
		[K in keyof XcmAssetArrayMap]: (assets: FungibleStrAssetType[]) => { [P in K]: XcmAssetArrayMap[K] };
	} = {
		V2: (assets) => ({ V2: assets as FungibleStrMultiAsset[] }),
		V3: (assets) => ({ V3: assets as FungibleStrMultiAsset[] }),
		V4: (assets) => ({ V4: assets as FungibleStrAsset[] }),
		V5: (assets) => ({ V5: assets as FungibleStrAsset[] }),
	};

	const factory = xcmAssetFactories[versionKey];

	if (!factory) {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}

	return factory(sortedAndDedupedMultiAssets);
};
