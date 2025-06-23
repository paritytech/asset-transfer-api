import type { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { CreateAssetsOpts, UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { DefaultHandler } from './default.js';

/**
 * XCM type generation for transactions from the relay chain to a parachain.
 */
export class RelayToPara extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The parachain Id of the destination.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest(destId: string, _xcmVersion: number = DEFAULT_XCM_VERSION): XcmDestBeneficiary {
		return this.xcmCreator.parachainDest({
			destId,
			parents: 0,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	async createAssets(
		amounts: string[],
		_xcmVersion: number,
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

	async createFeeAssetItem(_: ApiPromise): Promise<number> {
		return Promise.resolve(0);
	}
}
