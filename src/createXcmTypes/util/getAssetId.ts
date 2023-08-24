// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import { foreignAssetMultiLocationIsInCacheOrRegistry } from './foreignAssetMultiLocationIsInCacheOrRegistry';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';
import { getChainIdBySpecName } from './getChainIdBySpecName';

/**
 *
 * Given a valid token symbol or MultiLocation, returns it's corresponding integer or MultiLocation assetId
 * Errors if given an input that is not in the asset registry or not found in either
 * AssetHub's or the current Parachain's chain state.
 *
 * @param api ApiPromise
 * @param registry Registry
 * @param asset string
 * @param specName string
 * @param isForeignAssetsTransfer boolean
 */
export const getAssetId = async (
	_api: ApiPromise,
	registry: Registry,
	asset: string,
	specName: string,
	isForeignAssetsTransfer?: boolean
): Promise<string> => {
	const currentChainId = getChainIdBySpecName(registry, specName);
	const parsedAssetAsNumber = Number.parseInt(asset);
	const assetIsNumber = !Number.isNaN(parsedAssetAsNumber);
	const isParachain = parseInt(currentChainId) >= 2000;

	// if assets pallet, check the cache and return the cached assetId if found
	if (!isForeignAssetsTransfer) {
		const cachedAssetId = registry.cacheLookupAsset(asset);

		if (cachedAssetId) {
			// if asset is in the registry cache, return the assetId
			return cachedAssetId;
		}
	}

	// check the registry and return the assetId if found
	// currently the registry does not contain assetsInfo for parachains
	// so we skip checking them
	const { assetsInfo } = registry.currentRelayRegistry[currentChainId];
	if (!isParachain) {
		if (Object.keys(assetsInfo).length === 0) {
			throw new BaseError(
				`${specName} has no associated token symbol ${asset}`,
				BaseErrorsEnum.InvalidAsset
			);
		}
	}
	// check number assetId in registry
	if (assetIsNumber) {
		// if assetId index is valid, return the assetId
		if (assetsInfo[asset] && assetsInfo[asset].length > 0) {
			return asset;
		}
	} else {
		// get the corresponding assetId index from the assets registry based on symbol
		const registryAssetId = Object.keys(assetsInfo).find(
			(key) => assetsInfo[key].toLowerCase() === asset.toLowerCase()
		);

		if (registryAssetId) {
			// if asset is in registry, return the assetId
			return registryAssetId;
		}
	}

	let assetId = '';
	const isAssetHub = currentChainId === ASSET_HUB_CHAIN_ID;

	if (isAssetHub && isForeignAssetsTransfer) {
		// determine if we already have the multilocation in the cache or registry
		const multiLocationIsInRegistry =
			foreignAssetMultiLocationIsInCacheOrRegistry(_api, asset, registry);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(
				_api,
				registry,
				asset
			);

			if (!isValidForeignAsset) {
				throw new BaseError(
					`MultiLocation ${asset} not found`,
					BaseErrorsEnum.AssetNotFound
				);
			}

			assetId = asset;
		}
	} else if (!isParachain) {
		// if asset is an empty string we assign it the native relay assets symbol
		if (asset === '') {
			const { tokens } = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];

			assetId = tokens[0];
		} else if (assetIsNumber) {
			const maybeAsset = await _api.query.assets.asset(asset);

			if (maybeAsset.isSome) {
				assetId = asset;
				const assetMetadata = await _api.query.assets.metadata(asset);
				const assetSymbol = assetMetadata.symbol.toHuman()?.toString();

				if (assetSymbol) {
					// add queried asset to registry
					registry.setAssetInCache(asset, assetSymbol);
				}
			} else {
				throw new BaseError(
					`general index for assetId ${asset} was not found`,
					BaseErrorsEnum.AssetNotFound
				);
			}
		} else {
			throw new BaseError(
				`assetId ${asset} is not a valid symbol or integer asset id for ${specName}`,
				BaseErrorsEnum.InvalidAsset
			);
		}
	} else if (isParachain) {
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
					// add queried asset to registry
					registry.setAssetInCache(assetId, asset);
					break;
				}
			}
			if (assetId.length === 0) {
				throw new BaseError(
					`parachain assetId ${asset} is not a valid symbol assetIid in ${specName}`,
					BaseErrorsEnum.InvalidAsset
				);
			}
		} else {
			// if not assetHub and assetId is a number, query the parachain chain for the asset
			const parachainAsset = await _api.query.assets.asset(asset);
			if (parachainAsset.isSome) {
				assetId = asset;
				// add queried asset to registry
				registry.setAssetInCache(assetId, asset);
			} else {
				throw new BaseError(
					`parachain assetId ${asset} is not a valid integer assetIid in ${specName}`,
					BaseErrorsEnum.InvalidAsset
				);
			}
		}
	}

	return assetId;
};
