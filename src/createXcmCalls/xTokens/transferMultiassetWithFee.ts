// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { BaseError, BaseErrorsEnum } from '../../errors';
import type { CreateXcmCallOpts } from '../types';
import type { XTokensBaseArgs } from './types';

/**
 * Build a Polkadot-js `transferMultiassetWithFee` SubmittableExtrinsic
 * call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferMultiassetWithFee = async (
	baseArgs: XTokensBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { weightLimit, paysWithFeeDest, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;
	const ext = api.tx[baseArgs.xcmPallet].transferMultiassetWithFee;
	const typeCreator = createXcmTypes[direction];
	const destWeightLimit = typeCreator.createWeightLimit({
		weightLimit,
	});

	if (typeCreator.createXTokensAsset && typeCreator.createXTokensFeeAssetItem && typeCreator.createXTokensBeneficiary) {
		const amount = amounts[0];
		const assetId = assetIds[0];
		const asset = await typeCreator.createXTokensAsset(amount, xcmVersion, specName, assetId, {
			registry,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
			api,
		});
		const fee = typeCreator.createXTokensFeeAssetItem({
			registry,
			paysWithFeeDest,
			xcmVersion,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
		});

		const beneficiary = typeCreator.createXTokensBeneficiary(destChainId, destAddr, xcmVersion);

		return ext(asset, fee, beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets', BaseErrorsEnum.InternalError);
};
