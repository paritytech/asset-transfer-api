// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError } from '../../errors';

export const isValidForeignAssetMultiLocation = async (
	multilocationStr: string,
	_api: ApiPromise
): Promise<boolean> => {
	try {
		const multiLocation = _api.registry.createType(
			'MultiLocation',
			JSON.parse(multilocationStr)
		);

		const foreignAsset = await _api.query.foreignAssets.asset(multiLocation);

		// check if foreign asset exists
		if (foreignAsset.toString().length > 0) {
			return true;
		}

		return false;
	} catch (error) {
		const errorInfo = (error as Error).message.split('::');
		const errorDetails = errorInfo[errorInfo.length - 2].concat(
			errorInfo[errorInfo.length - 1]
		);

		throw new BaseError(`error creating MultiLocation type:${errorDetails}`);
	}
};
