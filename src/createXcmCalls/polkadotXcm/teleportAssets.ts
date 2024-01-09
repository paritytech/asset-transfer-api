// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import type { CreateXcmCallOpts } from '../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import type { PolkadotXcmBaseArgs } from './types';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `teleportAssets` call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const teleportAssets = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { paysWithFeeDest, isForeignAssetsTransfer } = opts;
	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].teleportAssets;
	const typeCreator = createXcmTypes[direction];
	const beneficiary = typeCreator.createBeneficiary(destAddr, xcmVersion);
	const dest = typeCreator.createDest(destChainId, xcmVersion);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer: false,
		api,
	});

	const feeAssetItem = paysWithFeeDest
		? await typeCreator.createFeeAssetItem(api, {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: false,
		  })
		: 0;

	return ext(dest, beneficiary, assets, feeAssetItem);
};
