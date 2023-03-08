import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import { AnyTuple } from '@polkadot/types/types';

import { createXcmTypes } from '../createXcmTypes';
import { IDirection } from '../types';

export const limitedReserveTransferAssets = (
	api: ApiPromise,
	direction: IDirection,
	destAddr: string,
	assetIds: string[],
	amounts: string[] | number[],
	destChainId: string,
	xcmVersion: number
) => {
	let call: SubmittableExtrinsicFunction<'promise', AnyTuple>;
	if (api.tx.polkadotXcm) {
		call = api.tx.polkadotXcm.limitedReserveTransferAssets;
	} else if (api.tx.xcmPallet) {
		call = api.tx.xcmPallet.limitedReserveTransferAssets;
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

	return call(beneficiary, dest, assets, 0, weightLimit);
};
