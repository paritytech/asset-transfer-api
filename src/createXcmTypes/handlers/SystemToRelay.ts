import type { ApiPromise } from '@polkadot/api';

import { CreateAssetsOpts, UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { createSingleAsset } from '../util/createAssets.js';
import { DefaultHandler } from './default.js';

export class SystemToRelay extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest(_: string, _xcmVersion: number): XcmDestBeneficiary {
		return this.xcmCreator.hereDest({ parents: 1 });
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	async createAssets(
		amounts: string[],
		xcmVersion: number,
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> {
		return createSingleAsset({
			amounts,
			parents: 1,
			xcmVersion,
		});
	}

	/**
	 * Return the correct feeAssetItem based on XCM direction.
	 * In this case it will always be zero since there is no `feeAssetItem` for this direction.
	 */
	async createFeeAssetItem(_: ApiPromise): Promise<number> {
		return Promise.resolve(0);
	}
}
