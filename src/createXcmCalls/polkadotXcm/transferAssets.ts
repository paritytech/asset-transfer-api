// Copyright 2024 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { getTypeCreator } from '../../createXcmTypes/index.js';
import { normalizeArrToStr } from '../../util/normalizeArrToStr.js';
import type { CreateXcmCallOpts } from '../types.js';
import { establishXcmPallet } from '../util/establishXcmPallet.js';
import type { PolkadotXcmBaseArgs } from './types.js';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferAssets` call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferAssets = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { weightLimit, paysWithFeeDest, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;
	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].transferAssets;
	const typeCreator = getTypeCreator(direction, xcmVersion);
	const beneficiary = typeCreator.createBeneficiary(destAddr);
	const dest = typeCreator.createDest(destChainId);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		api,
		destChainId,
	});

	const weightLimitValue = typeCreator.createWeightLimit({
		weightLimit,
	});

	const feeAssetItem = paysWithFeeDest
		? await typeCreator.createFeeAssetItem(api, {
				specName,
				assetIds,
				amounts,
				paysWithFeeDest,
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			})
		: 0;

	return ext(dest, beneficiary, assets, feeAssetItem, weightLimitValue);
};
