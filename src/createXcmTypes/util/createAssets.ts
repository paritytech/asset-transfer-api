import { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry/Registry.js';
import { type CreateAssetsOpts, type FungibleAssetType, XcmCreator, type XcmMultiAssets } from '../types.js';

export const createAssets = async ({
	amounts,
	specName,
	assets,
	opts,
	multiAssetCreator,
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
		registry: Registry;
		destChainId?: string;
		isForeignAssetsTransfer: boolean;
		isLiquidTokenTransfer: boolean;
		xcmCreator: XcmCreator;
	}) => Promise<FungibleAssetType[]>;
	xcmCreator: XcmCreator;
}): Promise<XcmMultiAssets> => {
	const sortedAndDedupedMultiAssets = await multiAssetCreator({
		api: opts.api,
		amounts,
		specName,
		assets,
		registry: opts.registry,
		destChainId: opts.destChainId,
		isForeignAssetsTransfer: opts.isForeignAssetsTransfer,
		isLiquidTokenTransfer: opts.isLiquidTokenTransfer,
		xcmCreator,
	});

	return xcmCreator.multiAssets(sortedAndDedupedMultiAssets);
};
