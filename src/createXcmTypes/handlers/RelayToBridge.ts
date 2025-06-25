import type { ApiPromise } from '@polkadot/api';

import { CreateAssetsOpts, UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { DefaultHandler } from './default.js';

export class RelayToBridge extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 */
	createDest(destId: string): XcmDestBeneficiary {
		return this.xcmCreator.interiorDest({
			destId,
			parents: 1,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 */
	async createAssets(
		amounts: string[],
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> {
		return Promise.resolve(
			this.xcmCreator.hereAsset({
				amount: amounts[0],
				parents: 0,
			}),
		);
	}

	/**
	 * Returns the correct `feeAssetItem` based on XCM direction.
	 *
	 * @param api ApiPromise
	 */
	async createFeeAssetItem(_: ApiPromise): Promise<number> {
		return Promise.resolve(0);
	}
}
