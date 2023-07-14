// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { ForeignAssetsInfo } from '../../registry/types';

export const foreignAssetMultiLocationIsInRegistry = (
	multilocationStr: string,
	registry: Registry,
	api: ApiPromise
): boolean => {
	try {
		const assetHubChainId = 1000;
		const multiLocation = api.registry.createType(
			'MultiLocation',
			JSON.parse(multilocationStr)
		);

		const { foreignAssetsInfo: maybeForeignAssetsInfo } =
			registry.currentRelayRegistry[assetHubChainId];

		if (Object.keys(maybeForeignAssetsInfo).length > 0) {
			const foreignAssetInfo = maybeForeignAssetsInfo as ForeignAssetsInfo;

			const foreignAssets = Object.entries(foreignAssetInfo).map((data) => {
				return data[1].multiLocation[0];
			});

			for (const asset of foreignAssets) {
				// regex removes commas that are found next to numbers in key values
				// (e.g "Parachain": "2,125" -> "Parachain": "2125")
				const foreignAssetMultiLocationStr = JSON.stringify(asset).replace(
					/(\d),/g,
					'$1'
				);

				const foreignAssetMultiLocation = api.registry.createType(
					'MultiLocation',
					JSON.parse(foreignAssetMultiLocationStr)
				);

				if (foreignAssetMultiLocation.toString() === multiLocation.toString()) {
					return true;
				}
			}
		}
	} catch (error) {
		const errorInfo = (error as Error).message.split('::');
		const errorDetails = errorInfo[errorInfo.length - 2].concat(
			errorInfo[errorInfo.length - 1]
		);
		throw new BaseError(`Error creating MultiLocation type:${errorDetails}`);
	}

	return false;
};
