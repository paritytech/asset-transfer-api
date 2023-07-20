// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { foreignAssetMultiLocationIsInRegistry } from './foreignAssetMultiLocationIsInRegistry';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';
import { getChainIdBySpecName } from './getChainIdBySpecName';
/**
 * Returns the correct asset id for a valid token symbol integer id
 * or foreign asset multilocation based on chain specName
 * errors if given an invalid symbol, integer id or multilocation that is
 * not registered or found in the chains state
 *
 * @param tokenSymbol string
 * @param specName string
 */
export const getChainAssetId = async (
	_api: ApiPromise,
	asset: string,
	specName: string,
	isForeignAssetsTransfer?: boolean
): Promise<string> => {
	let assetId = '';
	const newRegistry = new Registry(specName, {});
	const chainId = getChainIdBySpecName(newRegistry, specName);

	if (isForeignAssetsTransfer) {
		// determine if we already have the multilocation in the registry
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInRegistry(
			asset,
			newRegistry,
			_api
		);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(
				asset,
				_api
			);

			if (isValidForeignAsset) {
				assetId = asset;
			} else {
				throw new BaseError(`MultiLocation ${asset} not found`);
			}
		}
	} else {
		const { assetsInfo } = newRegistry.currentRelayRegistry[chainId];

		if (Object.keys(assetsInfo).length === 0) {
			throw new BaseError(
				`${specName} has no associated token symbol ${asset}`
			);
		}

		// get the corresponding asset id index from the assets registry
		const registryAssetId = Object.keys(assetsInfo).find(
			(key) => assetsInfo[key].toLowerCase() === asset.toLowerCase()
		);

		if (registryAssetId) {
			return registryAssetId;
		} else {
			const parsedAssetAsNumber = Number.parseInt(asset);
			const assetIsNumber = !Number.isNaN(parsedAssetAsNumber);

			// if the integer asset id asset is not found in the registry
			// query the chains state for the asset
			if (assetIsNumber) {
				const maybeAsset = await _api.query.assets.asset(asset);

				if (maybeAsset.isSome) {
					assetId = asset;
				} else {
					throw new BaseError(
						`general index for assetId ${asset} was not found`
					);
				}
			} else {
				throw new BaseError(
					`assetId ${asset} is not a valid symbol or integer asset id for ${specName}`
				);
			}
		}
	}

	return assetId;
};
