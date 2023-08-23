// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import { AssetMetadata } from '../../types';
import { getChainIdBySpecName } from './getChainIdBySpecName';

export const foreignAssetsMultiLocationExists = async (
	assetHubApi: ApiPromise,
	registry: Registry,
	multilocationStr: string
): Promise<boolean> => {
	try {
		const currentChainId = getChainIdBySpecName(registry, registry.specName);
		if (!registry.assetsCache[registry.relayChain][currentChainId]) {
			registry.assetsCache[registry.relayChain][currentChainId] = {
				assetsInfo: {},
				poolPairsInfo: {},
				foreignAssetsPalletInstance: null,
				assetsPalletInstance: null,
				specName: '',
				tokens: [],
				foreignAssetsInfo: {},
			};
		}

		const multiLocation = assetHubApi.registry.createType(
			'MultiLocation',
			JSON.parse(multilocationStr)
		);

		const foreignAsset = await assetHubApi.query.foreignAssets.asset(
			multiLocation
		);

		// check if foreign asset exists
		if (foreignAsset.toString().length > 0) {
			const foreignAssetMetadata = (
				await assetHubApi.query.foreignAssets.metadata(multilocationStr)
			).toHuman();

			if (foreignAssetMetadata) {
				const metadata = foreignAssetMetadata as AssetMetadata;
				const assetSymbol = metadata.symbol;
				const assetName = metadata.name;

				// cache the foreign asset
				registry.assetsCache[registry.relayChain][currentChainId][
					'foreignAssetsInfo'
				][assetSymbol] = {
					symbol: assetSymbol,
					name: assetName,
					multiLocation: JSON.stringify(multiLocation.toJSON()),
				};
			}

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
