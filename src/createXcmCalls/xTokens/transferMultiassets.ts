// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import type { XcmDestBenificiaryXcAssets } from '../../createXcmTypes/types';
import { UnionXcAssetsMultiAssets } from '../../createXcmTypes/types';
import { BaseError, BaseErrorsEnum } from '../../errors';
import type { Registry } from '../../registry';
import { XcmDirection } from '../../types';
import type { CreateXcmCallOpts } from '../types';
import { XcmPalletName } from '../util/establishXcmPallet';

/**
 * Build a Polkadot-js `transferMultiassets` SubmittableExtrinsic
 * call.
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
 * @param xcmPallet The pallet being used to construct xcm calls.
 * @param opts CreateXcmCallOpts
 */
export const transferMultiassets = async (
	api: ApiPromise,
	direction: XcmDirection,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	destChainId: string,
	xcmVersion: number,
	specName: string,
	registry: Registry,
	xcmPallet: XcmPalletName,
	opts: CreateXcmCallOpts
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { isLimited, weightLimit, paysWithFeeDest, isForeignAssetsTransfer, isLiquidTokenTransfer } = opts;
	const ext = api.tx[xcmPallet].transferMultiassets;
	const typeCreator = createXcmTypes[direction];

	const destWeightLimit = typeCreator.createWeightLimit({
		isLimited,
		weightLimit,
	});

	let assets: UnionXcAssetsMultiAssets;
	let beneficiary: XcmDestBenificiaryXcAssets;

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