// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { BaseError } from '../../errors';
import type { Registry } from '../../registry';
import { Direction } from '../../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferMultiAssetWithFee`
 * call.
 *
 * @param api ApiPromise
 * @param direction Denotes the xcm direction of the call.
 * @param destAddr The address the funds will be transfered too.
 * @param assetIds An array of asset ids. Note, this should be the same size and order as amounts.
 * @param amounts An array of amounts. Note, this should be the same size and order as assetIds.
 * @param destChainId The id of the destination chain. This will be zero for a relay chain.
 * @param xcmVersion Supported XCM version.
 */
export const transferMultiAsset = (
	api: ApiPromise,
	direction: Direction,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	xcmVersion: number,
	specName: string,
	registry: Registry,
	isLimited?: boolean,
	refTime?: string,
	proofSize?: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	const pallet = establishXcmPallet(api, direction);
	const ext = api.tx[pallet].transferMultiasset;
	const typeCreator = createXcmTypes[direction];
	const destWeightLimit = typeCreator.createWeightLimit(
		api,
		isLimited,
		refTime,
		proofSize
	);

	if (typeCreator.createXTokensAssets && typeCreator.createXTokensBeneficiary) {
		const assets = typeCreator.createXTokensAssets(
			api,
			amounts,
			xcmVersion,
			specName,
			assetIds,
			{ registry }
		);
		const beneficiary = typeCreator.createXTokensBeneficiary(
			destAddr,
			xcmVersion
		);

		return ext(assets[0], beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets');
};
