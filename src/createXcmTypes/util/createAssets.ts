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
		isForeignAssetsTransfer: boolean;
		isLiquidTokenTransfer: boolean;
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
		isForeignAssetsTransfer: opts.isForeignAssetsTransfer,
		isLiquidTokenTransfer: opts.isLiquidTokenTransfer,
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

/**
 * Create a VersionedMultiAsset structured type for a single asset.
 *
 * @param amounts The amount for a relay native asset. The length will always be one.
 * @param xcmVersion The accepted xcm version.
 */
export const createSingleAsset = ({
	amounts,
	parents,
	xcmVersion,
}: {
	amounts: string[];
	parents: number;
	xcmVersion: number;
}): Promise<UnionXcmMultiAssets> => {
	const multiAssets: FungibleStrAssetType[] = [];

	if (amounts.length != 1) {
		throw new BaseError(`Expected amounts of length 1, amounts=[${amounts.toString()}]`, BaseErrorsEnum.InvalidInput);
	}
	const amount = amounts[0];

	let multiAsset: FungibleStrAssetType;

	if ([2, 3].includes(xcmVersion)) {
		multiAsset = {
			fun: {
				Fungible: amount,
			},
			id: {
				Concrete: {
					interior: { Here: '' },
					parents,
				},
			},
		};
		multiAssets.push(multiAsset);
	} else if ([4, 5].includes(xcmVersion)) {
		multiAsset = {
			fun: {
				Fungible: amount,
			},
			id: {
				interior: { Here: '' },
				parents,
			},
		};
		multiAssets.push(multiAsset);
	} else {
		throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}

	switch (xcmVersion) {
		case 2:
			return Promise.resolve({ V2: multiAssets as FungibleStrMultiAsset[] });
		case 3:
			return Promise.resolve({ V3: multiAssets as FungibleStrMultiAsset[] });
		case 4:
			return Promise.resolve({ V4: multiAssets as FungibleStrAsset[] });
		case 5:
			return Promise.resolve({ V5: multiAssets as FungibleStrAsset[] });
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
