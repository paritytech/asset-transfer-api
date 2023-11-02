// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import type { ForeignAssetsData } from '../../registry/types';
import type { AssetMetadata } from '../../types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';

export const foreignAssetsMultiLocationExists = async (
	assetHubApi: ApiPromise,
	registry: Registry,
	multilocationStr: string,
	xcmVersion: number
): Promise<boolean> => {
	try {
		const multiLocation = resolveMultiLocation(assetHubApi, multilocationStr, xcmVersion);

		const foreignAsset = await assetHubApi.query.foreignAssets.asset(multiLocation);

		// check if foreign asset exists
		if (foreignAsset.toString().length > 0) {
			const foreignAssetMetadata = (await assetHubApi.query.foreignAssets.metadata(multiLocation)).toHuman();

			if (foreignAssetMetadata) {
				const metadata = foreignAssetMetadata as AssetMetadata;
				const assetSymbol = metadata.symbol;
				const assetName = metadata.name;
				const asset: ForeignAssetsData = {
					symbol: assetSymbol,
					name: assetName,
					multiLocation: JSON.stringify(multiLocation.toJSON()),
				};

				// cache the foreign asset
				registry.setForeignAssetInCache(assetSymbol, asset);
			}

			return true;
		}

		return false;
	} catch (error) {
		if ((error as Error).message.includes('::')) {
			const errorInfo = (error as Error).message.split('::');
			const errorDetails = errorInfo[errorInfo.length - 2].concat(errorInfo[errorInfo.length - 1]);

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
