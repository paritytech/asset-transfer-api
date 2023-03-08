import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import { AnyTuple, ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../createXcmTypes';
import { IDirection } from '../types';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `limitedReserveTransferAssets`
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
export const limitedReserveTransferAssets = (
	api: ApiPromise,
	direction: IDirection,
	destAddr: string,
	assetIds: string[],
	amounts: string[] | number[],
	destChainId: string,
	xcmVersion: number
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	let ext: SubmittableExtrinsicFunction<'promise', AnyTuple>;
	/**
	 * Check to see if one of the following pallets exists for constructing
	 * `limitedReserveTransferAssets`. When neither exist throw an error.
	 */
	if (api.tx.polkadotXcm) {
		ext = api.tx.polkadotXcm.limitedReserveTransferAssets;
	} else if (api.tx.xcmPallet) {
		ext = api.tx.xcmPallet.limitedReserveTransferAssets;
	} else {
		throw Error(
			"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
		);
	}

	const typeCreator = createXcmTypes[direction];
	const beneficiary = typeCreator.createBeneficiary(api, destAddr, xcmVersion);
	const dest = typeCreator.createDest(api, destChainId, xcmVersion);
	const assets = typeCreator.createAssets(api, assetIds, amounts, xcmVersion);

	// TODO: ensure this is correct type creation. Should we add this too the ICreateXcmTypes?
	const weightLimit = api.createType('XcmV2WeightLimit', { Unlimited: null });

	return ext(beneficiary, dest, assets, 0, weightLimit);
};
