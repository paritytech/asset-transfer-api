// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { CreateAssetsOpts, UnionXcmMultiAssets, XcmDestBeneficiary } from '../types.js';
import { createSingleAsset } from '../util/createAssets.js';
import { DefaultHandler } from './default.js';
/**
 * XCM type generation for transactions from the relay chain to a system parachain.
 */
export class RelayToSystem extends DefaultHandler {
	/**
	 * Create a XcmVersionedMultiLocation structured type for a destination.
	 *
	 * @param destId The parachain Id of the destination
	 * @param xcmVersion The accepted xcm version
	 */
	createDest(destId: string, _xcmVersion: number): XcmDestBeneficiary {
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
		xcmVersion: number,
		_specName: string,
		_assets: string[],
		_opts: CreateAssetsOpts,
	): Promise<UnionXcmMultiAssets> {
		return createSingleAsset({
			amounts,
			parents: 0,
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
