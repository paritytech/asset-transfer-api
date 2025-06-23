import { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { Registry } from '../../registry/Registry.js';
import { type CreateAssetsOpts, type FungibleAssetType, type UnionXcmMultiAssets, XcmCreator } from '../types.js';

export const createAssets = async ({
	amounts,
	specName,
	assets,
	opts,
	multiAssetCreator,
	xcmVersion = DEFAULT_XCM_VERSION,
	xcmCreator,
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
		isForeignAssetsTransfer: boolean;
		isLiquidTokenTransfer: boolean;
		xcmCreator: XcmCreator;
	}) => Promise<FungibleAssetType[]>;
	xcmVersion: number;
	xcmCreator: XcmCreator;
}): Promise<UnionXcmMultiAssets> => {
	const sortedAndDedupedMultiAssets = await multiAssetCreator({
		api: opts.api,
		amounts,
		specName,
		assets,
		xcmVersion,
		registry: opts.registry,
		destChainId: opts.destChainId,
		isForeignAssetsTransfer: opts.isForeignAssetsTransfer,
		isLiquidTokenTransfer: opts.isLiquidTokenTransfer,
		xcmCreator,
	});

	return xcmCreator.multiAssets(sortedAndDedupedMultiAssets);
};
