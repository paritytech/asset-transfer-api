// Copyright 2024 Parity Technologies (UK) Ltd.

import { UnionXcAssetsMultiAssets, XcmDestBeneficiary } from "src/createXcmTypes/types";

/**
 * Allow users to claim assets trapped during XCM execution
 *
 * @param api ApiPromise
 * @param assetIds string[]
 * @param beneficiaryAddress string
 */
export const claimAssets = async (
    api: ApiPromise,
	assetIds: string[],
	beneficiaryAddress: string,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const beneficiary = typeCreator.createBeneficiary(destAddr, xcmVersion);
    const pallet = establishXcmPallet(api);
    const ext = api.tx[pallet].limitedReserveTransferAssets;
	// const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
	// 	registry,
	// 	isForeignAssetsTransfer,
	// 	isLiquidTokenTransfer,
	// 	api,
	// });


	return ext(dest, beneficiary, assets, feeAssetItem, weightLimitType);
};
