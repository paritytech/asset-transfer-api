// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import type { XcmDestBeneficiaryXcAssets } from '../../createXcmTypes/types';
import { UnionXcAssetsMultiAssets } from '../../createXcmTypes/types';
import { BaseError, BaseErrorsEnum } from '../../errors';
import type { CreateXcmCallOpts } from '../types';
import type { XTokensBaseArgs } from './types';

/**
 * Build a Polkadot-js `transferMultiassets` SubmittableExtrinsic
 * call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferMultiassets = async (
	baseArgs: XTokensBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { weightLimit, paysWithFeeDest, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;
	const ext = api.tx[baseArgs.xcmPallet].transferMultiassets;
	const typeCreator = createXcmTypes[direction];

	const destWeightLimit = typeCreator.createWeightLimit({
		weightLimit,
	});

	let assets: UnionXcAssetsMultiAssets;
	let beneficiary: XcmDestBeneficiaryXcAssets;

	if (
		typeCreator.createXTokensAssets &&
		typeCreator.createXTokensFeeAssetItem &&
		typeCreator.createXTokensBeneficiary
	) {
		assets = await typeCreator.createXTokensAssets(amounts, xcmVersion, specName, assetIds, {
			registry,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
			api,
		});

		beneficiary = typeCreator.createXTokensBeneficiary(destChainId, destAddr, xcmVersion);
		return ext(assets, paysWithFeeDest, beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets', BaseErrorsEnum.InternalError);
};
