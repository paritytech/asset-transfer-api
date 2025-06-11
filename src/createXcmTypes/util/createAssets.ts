import { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { Registry } from '../../registry/Registry.js';
import {
	type CreateAssetsOpts,
	type FungibleStrAsset,
	type FungibleStrAssetType,
	type FungibleStrMultiAsset,
	type UnionXcmMultiAssets,
} from '../types.js';

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
	const sortedAndDedupedMultiAssets = await multiAssetCreator({
		api: opts.api,
		amounts,
		specName,
		assets,
		xcmVersion,
		registry: opts.registry,
		destChainId: opts.destChainId,
	});

	switch (xcmVersion) {
		case 2:
			return { V2: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[] };
		case 3:
			return { V3: sortedAndDedupedMultiAssets as FungibleStrMultiAsset[] };
		case 4:
			return { V4: sortedAndDedupedMultiAssets as FungibleStrAsset[] };
		case 5:
			return { V5: sortedAndDedupedMultiAssets as FungibleStrAsset[] };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
