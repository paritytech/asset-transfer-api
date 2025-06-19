import type { ApiPromise } from '@polkadot/api';

import {
	UnionXcAssetsMultiAsset,
	UnionXcmMultiAssets,
	XcmDestBeneficiary,
	XcmDestBeneficiaryXcAssets,
} from '../types.js';
import { createSingleAsset } from '../util/createAssets.js';
import { createXTokensDestBeneficiary } from '../util/createBeneficiary.js';
import { createHereDest } from '../util/createDest.js';
import { createXTokensAssetToRelay } from '../util/createXTokensAssets.js';
import { DefaultHandler } from './default.js';

export class ParaToRelay extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The destId in this case, which is the relay chain.
	 * @param xcmVersion The accepted xcm version.
	 */
	createDest(_: string, xcmVersion: number): XcmDestBeneficiary {
		return createHereDest({ xcmVersion, parents: 1 });
	}

	/**
	 * Create a VersionedMultiAsset structured type.
	 *
	 * @param amounts The amount for a relay native asset. The length will always be one.
	 * @param xcmVersion The accepted xcm version.
	 */
	createAssets(amounts: string[], xcmVersion: number): Promise<UnionXcmMultiAssets> {
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

	createXTokensBeneficiary(_: string, accountId: string, xcmVersion: number): XcmDestBeneficiaryXcAssets {
		return createXTokensDestBeneficiary(accountId, xcmVersion);
	}

	createXTokensAsset(amount: string, xcmVersion: number): Promise<UnionXcAssetsMultiAsset> {
		return createXTokensAssetToRelay({
			amount,
			parents: 1,
			xcmVersion,
		});
	}
}
