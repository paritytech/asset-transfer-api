// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';

export const foreignAssetsMultiLocationExists = async (
	assetHubApi: ApiPromise,
	multilocationStr: string
): Promise<boolean> => {
	try {
		const multiLocation = assetHubApi.registry.createType(
			'MultiLocation',
			JSON.parse(multilocationStr)
		);

		const foreignAsset = await assetHubApi.query.foreignAssets.asset(
			multiLocation
		);

		// check if foreign asset exists
		if (foreignAsset.toString().length > 0) {
			return true;
		}

		return false;
	} catch (error) {
		if ((error as Error).message.includes('::')) {
			const errorInfo = (error as Error).message.split('::');
			const errorDetails = errorInfo[errorInfo.length - 2].concat(
				errorInfo[errorInfo.length - 1]
			);

			throw new BaseError(
				`Error creating MultiLocation type:${errorDetails}`,
				BaseErrorsEnum.InvalidMultiLocationAsset
			);
		} else {
			throw new BaseError(
				`Error creating multilocation type: ${(error as Error).message}`,
				BaseErrorsEnum.InvalidMultiLocationAsset
			);
		}
	}
};
