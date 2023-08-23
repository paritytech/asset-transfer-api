// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { foreignAssetMultiLocationIsInRegistry } from './foreignAssetMultiLocationIsInRegistry';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';
import { getChainIdBySpecName } from './getChainIdBySpecName';

/**
 * Given a valid AssetHub token symbol or ForeignAsset MultiLocation, returns it's corresponding integer assetId.
 * Errors if given an input that is not in the registry or found in the AssetHub chain state.
 *
 * @param api
 * @param tokenSymbol string
 * @param specName string
 * @param isForeignAssetsTransfer boolean
 */
export const getAssetHubAssetId = async (
	_api: ApiPromise,
	asset: string,
	specName: string,
	isForeignAssetsTransfer?: boolean
): Promise<string> => {
	let assetId = '';
	const registry = new Registry(specName, {});
	const currentChainId = getChainIdBySpecName(registry, specName);
	const isAssetHub = currentChainId === ASSET_HUB_CHAIN_ID;

	if (isAssetHub && isForeignAssetsTransfer) {
		// determine if we already have the multilocation in the registry
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInRegistry(
			_api,
			asset,
			registry
		);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(
				_api,
				asset
			);

			if (!isValidForeignAsset) {
				throw new BaseError(`MultiLocation ${asset} not found`);
			}

			assetId = asset;
		}
	} else {
		// if asset is an empty string we assign it the native relay assets symbol
		if (asset === '') {
			const { tokens } = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];

			assetId = tokens[0];
		} else {
			const parsedAssetAsNumber = Number.parseInt(asset);
			const assetIsNumber = !Number.isNaN(parsedAssetAsNumber);

			// check asset transfer api registry for assetId
			if (parseInt(currentChainId) < 2000) {
				const { assetsInfo } = registry.currentRelayRegistry[currentChainId];

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
					// if the integer assetId is not found in the registry
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
			} else if (parseInt(currentChainId) >= 2000) {
				if (!assetIsNumber) {
					// if not assetHub and assetId isnt a number, query the parachain chain for the asset symbol
					const parachainAssets = await _api.query.assets.asset.entries();

					for (let i = 0; i < parachainAssets.length; i++) {
						const parachainAsset = parachainAssets[i];
						const id = parachainAsset[0].args[0];

						const metadata = await _api.query.assets.metadata(id);
						if (
							metadata.symbol.toHuman()?.toString().toLowerCase() ===
							asset.toLowerCase()
						) {
							assetId = id.toString();
							break;
						}
					}
					if (assetId.length === 0) {
						throw new BaseError(
							`parachain assetId ${asset} is not a valid symbol assetIid in ${specName}`
						);
					}
				} else {
					// if not assetHub and assetId is a number, query the parachain chain for the asset
					const parachainAsset = await _api.query.assets.asset(asset);
					if (parachainAsset.isSome) {
						assetId = asset;
					} else {
						throw new BaseError(
							`parachain assetId ${asset} is not a valid integer assetIid in ${specName}`
						);
					}
				}
			}
		}
	}

	return assetId;
};
