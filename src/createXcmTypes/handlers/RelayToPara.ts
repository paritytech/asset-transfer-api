import type { ApiPromise } from '@polkadot/api';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { createSingleAsset } from '../util/createAssets.js';
import { createParachainDest } from '../util/createDest.js';
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
	createDest(destId: string, xcmVersion: number = DEFAULT_XCM_VERSION): XcmDestBeneficiary {
		return createParachainDest({
			destId,
			parents: 0,
			xcmVersion,
		});
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	async createAssets(amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> {
		return createSingleAsset({
			amounts,
			parents: 0,
			xcmVersion,
		});
	}

	async createFeeAssetItem(_: ApiPromise): Promise<number> {
		return Promise.resolve(0);
	}
}
