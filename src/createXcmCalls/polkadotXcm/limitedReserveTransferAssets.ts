import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { getTypeCreator } from '../../createXcmTypes/index.js';
import { normalizeArrToStr } from '../../util/normalizeArrToStr.js';
import type { CreateXcmCallOpts } from '../types.js';
import { establishXcmPallet } from '../util/establishXcmPallet.js';
import type { PolkadotXcmBaseArgs } from './types.js';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `limitedReserveTransferAssets`
 * call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const limitedReserveTransferAssets = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { weightLimit, paysWithFeeDest, isLiquidTokenTransfer, isForeignAssetsTransfer } = opts;
	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].limitedReserveTransferAssets;
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
	const weightLimitType = typeCreator.createWeightLimit({
		weightLimit,
	});

	const feeAssetItem = paysWithFeeDest
		? await typeCreator.createFeeAssetItem(api, {
				registry,
				paysWithFeeDest,
				specName,
				assetIds,
				amounts,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			})
		: 0;

	return ext(dest, beneficiary, assets, feeAssetItem, weightLimitType);
};
