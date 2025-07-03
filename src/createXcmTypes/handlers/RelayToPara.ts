import type { ApiPromise } from '@polkadot/api';

import { CreateAssetsOpts, XcmDestBeneficiary, XcmMultiAssets } from '../types.js';
import { DefaultHandler } from './default.js';

/**
 * XCM type generation for transactions from the relay chain to a parachain.
 */
export class RelayToPara extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The parachain Id of the destination.
	 */
	createDest(destId: string): XcmDestBeneficiary {
		return this.xcmCreator.parachainDest({
			destId,
			parents: 0,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 */
	async createAssets(
		amounts: string[],
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<XcmMultiAssets> {
		return Promise.resolve(
			this.xcmCreator.hereAsset({
				amount: amounts[0],
				parents: 0,
			}),
		);
	}

	async createFeeAssetItem(_: ApiPromise): Promise<number> {
		return Promise.resolve(0);
	}
}
