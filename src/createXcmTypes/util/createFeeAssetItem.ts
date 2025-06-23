import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { Registry } from '../../registry/Registry.js';
import { getFeeAssetItemIndex } from '../../util/getFeeAssetItemIndex.js';
import { type CreateFeeAssetItemOpts, type FungibleAssetType, XcmCreator } from '../types.js';
import { isSystemChain } from './isSystemChain.js';

/**
 * Return the correct feeAssetItem based on XCM direction.
 * In this case it will always be zero since there is no `feeAssetItem` for this direction.
 *
 * Default values are hacks to avoid unraveling the CreateFeeAssetItemOpts type
 * and everything that it touches.
 */
export const createFeeAssetItem = async ({
	api,
	opts: {
		amounts = [],
		assetIds = [],
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		paysWithFeeDest = '',
		registry,
		specName = '',
	},
	multiAssetCreator,
	verifySystemChain = false,
	xcmCreator,
}: {
	api: ApiPromise;
	opts: CreateFeeAssetItemOpts;
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
	verifySystemChain?: boolean;
	xcmCreator: XcmCreator;
}): Promise<number> => {
	if (xcmCreator.xcmVersion === 2) {
		return 0;
	}
	const multiAssets = await multiAssetCreator({
		api,
		amounts,
		specName,
		assets: assetIds,
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		xcmCreator,
	});

	if (verifySystemChain) {
		const systemChainId = registry.lookupChainIdBySpecName(specName);
		if (!isSystemChain(systemChainId)) {
			throw new BaseError(
				`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`,
				BaseErrorsEnum.InternalError,
			);
		}
	}

	const assetIndex = getFeeAssetItemIndex({
		api,
		registry,
		paysWithFeeDest,
		multiAssets,
		specName,
		xcmCreator,
		isForeignAssetsTransfer,
	});

	return assetIndex;
};
