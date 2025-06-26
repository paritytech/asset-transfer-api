import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createAssetLocations } from '../../createXcmTypes/util/createAssetLocations.js';
import { createBeneficiary } from '../../createXcmTypes/util/createBeneficiary.js';
import { getXcmCreator } from '../../createXcmTypes/xcm/index.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { Registry } from '../../registry/index.js';
import { CreateXcmCallOpts } from '../types.js';
import { establishXcmPallet } from '../util/establishXcmPallet.js';

/**
 * Allow users to claim assets trapped locally on-chain during failed XCM execution.
 *
 * @param api ApiPromise
 * @param assetLocations string[]
 * @param amounts string[]
 * @param xcmVersion number
 * @param beneficiaryAddress string
 */
export const claimAssets = async (
	api: ApiPromise,
	registry: Registry,
	specName: string,
	assetIds: string[],
	amounts: string[],
	beneficiaryAddress: string,
	xcmVersion: number,
	originChainId: string,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { isForeignAssetsTransfer: assetIdsContainLocations, isLiquidTokenTransfer } = opts;
	const xcmCreator = getXcmCreator(xcmVersion);
	const beneficiary = createBeneficiary(beneficiaryAddress, xcmCreator);

	const assets = await createAssetLocations({
		api,
		assetIds,
		specName,
		amounts,
		registry,
		originChainId,
		assetIdsContainLocations,
		isLiquidTokenTransfer,
		xcmCreator,
	});

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].claimAssets;

	if (!ext) {
		throw new BaseError(
			`Did not find claimAssets call from pallet ${pallet} in the current runtime.`,
			BaseErrorsEnum.RuntimeCallNotFound,
		);
	}

	return ext(assets, beneficiary);
};
