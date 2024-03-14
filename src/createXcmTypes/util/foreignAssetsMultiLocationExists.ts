// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import type { ForeignAssetsData } from '../../registry/types';
import type { AssetMetadata } from '../../types';
import { UnionXcAssetsMultiLocation } from '../types';

export const foreignAssetsMultiLocationExists = async (
	assetHubApi: ApiPromise,
	registry: Registry,
	multilocationStr: string,
): Promise<boolean> => {
	try {
		const rawMultiLocation = JSON.parse(multilocationStr) as UnionXcAssetsMultiLocation;
		const foreignAsset = await assetHubApi.query.foreignAssets.asset(
			JSON.parse(multilocationStr) as UnionXcAssetsMultiLocation,
		);

		console.log('FOREIGN ASSET IS', JSON.stringify(foreignAsset));
		console.log('LENGTH', foreignAsset.toString().length > 0);
		// check if foreign asset exists
		if (foreignAsset.toString().length > 0) {
			const foreignAssetMetadata = (await assetHubApi.query.foreignAssets.metadata(rawMultiLocation)).toHuman();

			console.log('DOES METADATA EXIST', JSON.stringify(foreignAssetMetadata));
			if (foreignAssetMetadata) {
				const metadata = foreignAssetMetadata as AssetMetadata;
				const assetSymbol = metadata.symbol;
				const assetName = metadata.name;
				const asset: ForeignAssetsData = {
					symbol: assetSymbol,
					name: assetName,
					multiLocation: JSON.stringify(rawMultiLocation),
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
				BaseErrorsEnum.InvalidMultiLocationAsset,
			);
		} else {
			throw new BaseError(
				`Error creating multilocation type: ${(error as Error).message}`,
				BaseErrorsEnum.InvalidMultiLocationAsset,
			);
		}
	}
};
