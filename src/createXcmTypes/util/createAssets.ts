import { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { Registry } from '../../registry/Registry.js';
import {
	type CreateAssetsOpts,
	type FungibleAsset,
	type FungibleAssetType,
	type FungibleMultiAsset,
	type UnionXcmMultiAssets,
	XcmCreator,
} from '../types.js';

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
	const multiAssets: FungibleAssetType[] = [];

	if (amounts.length != 1) {
		throw new BaseError(`Expected amounts of length 1, amounts=[${amounts.toString()}]`, BaseErrorsEnum.InvalidInput);
	}
	const amount = amounts[0];

	let multiAsset: FungibleAssetType;

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
			return Promise.resolve({ V2: multiAssets as FungibleMultiAsset[] });
		case 3:
			return Promise.resolve({ V3: multiAssets as FungibleMultiAsset[] });
		case 4:
			return Promise.resolve({ V4: multiAssets as FungibleAsset[] });
		case 5:
			return Promise.resolve({ V5: multiAssets as FungibleAsset[] });
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
