import type { ApiPromise } from '@polkadot/api';

import { UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { createSingleAsset } from '../util/createAssets.js';
import { createInteriorValueDest } from '../util/createDest.js';
import { DefaultHandler } from './default.js';

export class RelayToBridge extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The chainId of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest(destId: string, xcmVersion: number): XcmDestBeneficiary {
		return createInteriorValueDest({
			destId,
			parents: 1,
			xcmVersion,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts Amount per asset. It will match the `assets` length.
	 * @param xcmVersion The accepted xcm version.
	 */
	async createAssets(amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> {
		return createSingleAsset({
			amounts,
			parents: 0,
			xcmVersion,
		});
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
