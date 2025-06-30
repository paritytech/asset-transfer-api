import type { ApiPromise } from '@polkadot/api';

import {
	CreateAssetsOpts,
	CreateFeeAssetItemOpts,
	XcAssetsMultiAsset,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
	XcmMultiAssets,
} from '../types.js';
import { createXTokensDestBeneficiary } from '../util/createBeneficiary.js';
import { createXTokensAssetToRelay } from '../util/createXTokensAssets.js';
import { DefaultHandler } from './default.js';

export class ParaToRelay extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain.
	 */
	createDest(_: string): XcmDestBeneficiary {
		return this.xcmCreator.hereDest({ parents: 1 });
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 */
	createAssets(
		amounts: string[],
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<XcmMultiAssets> {
		return Promise.resolve(
			this.xcmCreator.hereAsset({
				amount: amounts[0],
				parents: 1,
			}),
		);
	}

	/**
	 * Return the correct feeAssetItem based on XCM direction.
	 * In this case it will always be zero since there is no `feeAssetItem` for this direction.
	 */
	async createFeeAssetItem(_api: ApiPromise, _opts: CreateFeeAssetItemOpts): Promise<number> {
		return Promise.resolve(0);
	}

	createXTokensBeneficiary(_: string, accountId: string): XcmDestBeneficiaryXcAssets {
		return createXTokensDestBeneficiary(accountId, this.xcmCreator);
	}

	createXTokensAsset(
		amount: string,
		_specName: string,
		_asset: string,
		_opts: CreateAssetsOpts,
	): Promise<XcAssetsMultiAsset> {
		return Promise.resolve(
			createXTokensAssetToRelay({
				amount,
				parents: 1,
				xcmCreator: this.xcmCreator,
			}),
		);
	}
}
