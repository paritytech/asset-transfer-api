// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import type { Registry } from '../../registry';
import { XcmDirection } from '../../types';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import type { CreateXcmCallOpts } from '../types';
import { establishXcmPallet } from '../util/establishXcmPallet';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `limitedTeleportAssets` call.
 *
 * @param api ApiPromise
 * @param direction Denotes the xcm direction of the call.
 * @param destAddr The address the funds will be transfered too.
 * @param assetIds An array of asset ids. Note, this should be the same size and order as amounts.
 * @param amounts An array of amounts. Note, this should be the same size and order as assetIds.
 * @param destChainId The id of the destination chain. This will be zero for a relay chain.
 * @param xcmVersion Supported XCM version.
 * @param specName The specName for the current chain
 * @param registry Registry
 * @param opts CreateXcmCallOpts
 */
export const limitedTeleportAssets = async (
	api: ApiPromise,
	direction: XcmDirection,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	destChainId: string,
	xcmVersion: number,
	specName: string,
	registry: Registry,
	opts: CreateXcmCallOpts
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { isLimited, weightLimit, paysWithFeeDest, isForeignAssetsTransfer } = opts;
	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].limitedTeleportAssets;
	const typeCreator = createXcmTypes[direction];
	const beneficiary = typeCreator.createBeneficiary(destAddr, xcmVersion);
	const dest = typeCreator.createDest(destChainId, xcmVersion);
	const assets = await typeCreator.createAssets(api, normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer: false,
	});
	const weightLimitType = typeCreator.createWeightLimit(api, {
		isLimited,
		weightLimit,
	});

	const feeAssetItem = paysWithFeeDest
		? await typeCreator.createFeeAssetItem(api, {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: false,
		  })
		: api.registry.createType('u32', 0);

	return ext(dest, beneficiary, assets, feeAssetItem, weightLimitType);
};
