// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
// import { u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { CreateWeightLimitOpts } from '../../createXcmTypes/types';
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
export const transferMultiAssetWithFee = async (
	api: ApiPromise,
	direction: Direction,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	destChainId: string,
	xcmVersion: number,
	specName: string,
	registry: Registry,
	paysWithFeeDest: string,
	opts: CreateWeightLimitOpts
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const pallet = establishXcmPallet(api, direction);
	const ext = api.tx[pallet].transferMultiassetWithFee;
	const typeCreator = createXcmTypes[direction];
	const destWeightLimit = typeCreator.createWeightLimit(api, {
		isLimited: opts.isLimited,
		refTime: opts.refTime,
		proofSize: opts.proofSize,
	});

	if (
		typeCreator.createXTokensAsset &&
		typeCreator.createXTokensFeeAssetItem &&
		typeCreator.createXTokensBeneficiary
	) {
		const amount = amounts[0];
		const assetId = assetIds[0];
		const asset = await typeCreator.createXTokensAsset(
			api,
			amount,
			xcmVersion,
			specName,
			assetId,
			{ registry }
		);
		const fee = typeCreator.createXTokensFeeAssetItem(api, {
			registry,
			paysWithFeeDest,
			xcmVersion,
		});

		const beneficiary = typeCreator.createXTokensBeneficiary(
			destChainId,
			destAddr,
			xcmVersion
		);

		return ext(asset, fee, beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets');
};
