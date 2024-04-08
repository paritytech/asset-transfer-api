// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createBeneficiary } from '../../createXcmTypes/util/createBeneficiary';
import { createClaimableAssetLocations } from '../../createXcmTypes/util/createClaimableAssetLocations';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { establishXcmPallet } from '../util/establishXcmPallet';

/**
 * Allow users to claim assets trapped during XCM execution
 *
 * @param api ApiPromise
 * @param assetLocations string[]
 * @param amounts string[]
 * @param xcmVersion number
 * @param beneficiaryAddress string
 */
export const claimAssets = async (
	api: ApiPromise,
	assetLocations: string[],
	amounts: string[],
	xcmVersion: number,
	beneficiaryAddress: string,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const beneficiary = createBeneficiary(beneficiaryAddress, xcmVersion);

	const assets = await createClaimableAssetLocations(assetLocations, amounts, xcmVersion);

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].claimAssets;

	if (!ext) {
		throw new BaseError(
			`Did not find claimAssets call from pallet ${pallet} in the current runtime`,
			BaseErrorsEnum.RuntimeCallNotFound,
		);
	}

	return ext(assets, beneficiary);
};
