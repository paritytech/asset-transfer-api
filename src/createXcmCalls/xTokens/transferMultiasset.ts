// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { BaseError, BaseErrorsEnum } from '../../errors';
import type { CreateXcmCallOpts } from '../types';
import type { XTokensBaseArgs } from './types';

/**
 * Build a Polkadot-js `transferMultiasset` SubmittableExtrinsic
 * call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferMultiasset = async (
	baseArgs: XTokensBaseArgs,
	opts: CreateXcmCallOpts
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { isLimited, weightLimit, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;
	const ext = api.tx[baseArgs.xcmPallet].transferMultiasset;
	const typeCreator = createXcmTypes[direction];
	const destWeightLimit = typeCreator.createWeightLimit({
		isLimited,
		weightLimit,
	});

	if (typeCreator.createXTokensAsset && typeCreator.createXTokensBeneficiary) {
		const amount = amounts[0];
		const assetId = assetIds[0];

		const asset = await typeCreator.createXTokensAsset(amount, xcmVersion, specName, assetId, {
			registry,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
			api,
		});
		const beneficiary = typeCreator.createXTokensBeneficiary(destChainId, destAddr, xcmVersion);

		return ext(asset, beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets', BaseErrorsEnum.InternalError);
};
