import type { ApiPromise } from '@polkadot/api';

import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	ICreateXcmType,
	UnionXcAssetsMultiAssets,
	UnionXcAssetsMultiLocation,
	UnionXcmMultiAssets,
	XcmCreator,
	XcmDestBeneficiary,
	XcmWeight,
} from '../types.js';
import { createBeneficiary } from '../util/createBeneficiary.js';
import { createWeightLimit } from '../util/createWeightLimit.js';
import { createXTokensMultiAssets } from '../util/createXTokensAssets.js';
import { createXTokensFeeAssetItem } from '../util/createXTokensFeeAssetItem.js';
import { getXcmCreator } from '../xcm/index.js';

/**
 * These methods are uniform across all handlers / directions
 */
export abstract class DefaultHandler implements ICreateXcmType {
	xcmCreator: XcmCreator;

	constructor(xcmVersion: number) {
		this.xcmCreator = getXcmCreator(xcmVersion);
	}

	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 * @param xcmVersion The accepted xcm version.
	 */
	createBeneficiary(accountId: string, _xcmVersion: number): XcmDestBeneficiary {
		return createBeneficiary(accountId, this.xcmCreator);
	}

	/**
	 * Create an Xcm WeightLimit structured type.
	 *
	 * @param opts Options that are used for WeightLimit.
	 */
	createWeightLimit(opts: CreateWeightLimitOpts) {
		return createWeightLimit(opts);
	}

	// Unique per handler

	createDest(_destId: string, _xcmVersion: number): XcmDestBeneficiary {
		throw new Error('Not Implemented');
	}

	createAssets(
		_amounts: string[],
		_xcmVersion: number,
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> {
		throw new Error('Not Implemented');
	}

	createFeeAssetItem(_api: ApiPromise, _opts: CreateFeeAssetItemOpts): Promise<number> {
		throw new Error('Not Implemented');
	}

	// XTokens methods don't need to be included here
	// I don't think it hurts to include them,
	// BUT there may be code that checks if a method exists
	// So be careful and double check this before merge.

	createXTokensAssets(
		amounts: string[],
		_xcmVersion: number,
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<UnionXcAssetsMultiAssets> {
		return createXTokensMultiAssets({
			amounts,
			assets,
			specName,
			opts,
			xcmCreator: this.xcmCreator,
		});
	}
	createXTokensWeightLimit(_opts: CreateWeightLimitOpts): XcmWeight {
		// This was never implemented anywhere and only existed in the interface
		throw new Error('Not Implemented');
	}

	createXTokensFeeAssetItem({ paysWithFeeDest }: { paysWithFeeDest?: string }): UnionXcAssetsMultiLocation {
		return createXTokensFeeAssetItem({ paysWithFeeDest, xcmCreator: this.xcmCreator });
	}
}
