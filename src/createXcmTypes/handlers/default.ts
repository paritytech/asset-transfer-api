import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	CreateWeightLimitOpts,
	ICreateXcmType,
	XcAssetsMultiLocation,
	XcmCreator,
	XcmMultiAssets,
	XcmVersionedMultiLocation,
	XcmWeight,
} from '../types.js';
import { createBeneficiary } from '../util/createBeneficiary.js';
import { createWeightLimit } from '../util/createWeightLimit.js';
import { createXTokensMultiAssets } from '../util/createXTokensAssets.js';
import { getXcmCreator } from '../xcm/index.js';

/**
 * These methods are uniform across all handlers / directions
 */
export class DefaultHandler implements ICreateXcmType {
	xcmCreator: XcmCreator;

	constructor(xcmVersion: number) {
		this.xcmCreator = getXcmCreator(xcmVersion);
	}

	/**
	 * Create a XcmVersionedMultiLocation structured type for a beneficiary.
	 *
	 * @param accountId The accountId of the beneficiary.
	 */
	createBeneficiary(accountId: string): XcmVersionedMultiLocation {
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

	createDest(_destId: string): XcmVersionedMultiLocation {
		throw new Error('Not Implemented');
	}

	createAssets(
		_amounts: string[],
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<XcmMultiAssets> {
		throw new Error('Not Implemented');
	}

	createFeeAssetItem(_api: ApiPromise, _opts: CreateFeeAssetItemOpts): Promise<number> {
		throw new Error('Not Implemented');
	}

	// XTokens methods

	createXTokensAssets(
		amounts: string[],
		specName: string,
		assets: string[],
		opts: CreateAssetsOpts,
	): Promise<XcmMultiAssets> {
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

	createXTokensFeeAssetItem({ paysWithFeeDest }: { paysWithFeeDest?: string }): XcAssetsMultiLocation {
		if (!paysWithFeeDest) {
			throw new BaseError(
				'failed to create xTokens fee multilocation. "paysWithFeeDest" is required.',
				BaseErrorsEnum.InternalError,
			);
		}

		const paysWithFeeMultiLocation = this.xcmCreator.resolveMultiLocation(paysWithFeeDest);
		return this.xcmCreator.multiLocation(paysWithFeeMultiLocation);
	}
}
