// Copyright 2024 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { AnyJson } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { createDefaultXcmOnDestination } from '../../createXcmTypes/util/createDefaultXcmOnDestination';
import { createXcmOnDestBeneficiary } from '../../createXcmTypes/util/createXcmOnDestBeneficiary';
import { createXcmVersionedAssetId } from '../../createXcmTypes/util/createXcmVersionedAssetId';
import { resolveAssetTransferType } from '../../createXcmTypes/util/resolveAssetTransferType';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import type { CreateXcmCallOpts } from '../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import type { PolkadotXcmBaseArgs } from './types';
/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferAssetsUsingTypeAndThen` call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferAssetsUsingTypeAndThen = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const {
		weightLimit,
		paysWithFeeDest,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		assetTransferType: assetTransferTypeStr,
		remoteReserveAssetTransferTypeLocation,
		feesTransferType: feesTransferTypeStr,
		remoteReserveFeesTransferTypeLocation,
		customXcmOnDest: customXcmOnDestStr,
	} = opts;

	if (!paysWithFeeDest || !assetTransferTypeStr || !feesTransferTypeStr) {
		throw new BaseError(
			'transferAssetsUsingTypeAndThen: required bridge inputs not found',
			BaseErrorsEnum.InvalidInput,
		);
	}

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].transferAssetsUsingTypeAndThen;
	const typeCreator = createXcmTypes[direction];
	const beneficiary = createXcmOnDestBeneficiary(destAddr, xcmVersion);
	const dest = typeCreator.createDest(destChainId, xcmVersion);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		api,
	});

	const weightLimitValue = typeCreator.createWeightLimit({
		weightLimit,
	});
	const assetTransferType = resolveAssetTransferType(
		feesTransferTypeStr,
		xcmVersion,
		remoteReserveAssetTransferTypeLocation,
	);
	const feeAssetTransferType = resolveAssetTransferType(
		feesTransferTypeStr,
		xcmVersion,
		remoteReserveFeesTransferTypeLocation,
	);
	const remoteFeesId = createXcmVersionedAssetId(paysWithFeeDest, xcmVersion);

	const defaultDestXcm = createDefaultXcmOnDestination(beneficiary, xcmVersion);
	const customXcmOnDest = customXcmOnDestStr ? (JSON.parse(customXcmOnDestStr) as AnyJson) : defaultDestXcm;

	return ext(dest, assets, assetTransferType, remoteFeesId, feeAssetTransferType, customXcmOnDest, weightLimitValue);
};
