// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { Registry } from '../../registry';
import { validateNumber } from '../../validate';
import { foreignAssetMultiLocationIsInCacheOrRegistry } from './foreignAssetMultiLocationIsInCacheOrRegistry';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';

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
	xcmVersion: number,
	isForeignAssetsTransfer?: boolean
): Promise<string> => {
	console.log('GET ASSET ID');
	const currentChainId = registry.lookupChainIdBySpecName(specName);
	const assetIsValidInt = validateNumber(asset);
	const isParachain = new BN(currentChainId).gte(new BN(2000));

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
			throw new BaseError(`${specName} has no associated token symbol ${asset}`, BaseErrorsEnum.InvalidAsset);
		}
	}
	// check number assetId in registry
	if (assetIsValidInt) {
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
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(asset, registry, xcmVersion);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(_api, registry, asset, xcmVersion);

			if (!isValidForeignAsset) {
				throw new BaseError(`MultiLocation ${asset} not found`, BaseErrorsEnum.AssetNotFound);
			}

			assetId = asset;
		}
	} else if (!isParachain) {
		// if asset is an empty string we assign it the native relay assets symbol
		if (asset === '') {
			const { tokens } = registry.currentRelayRegistry[ASSET_HUB_CHAIN_ID];

			assetId = tokens[0];
		} else if (assetIsValidInt) {
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
				throw new BaseError(`general index for assetId ${asset} was not found`, BaseErrorsEnum.AssetNotFound);
			}
		} else {
			throw new BaseError(
				`assetId ${asset} is not a valid symbol or integer asset id for ${specName}`,
				BaseErrorsEnum.InvalidAsset
			);
		}
	} else if (isParachain) {
		const paraId = registry.lookupChainIdBySpecName(specName);
	
		const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData;
		const currentRelayChainSpecName = registry.relayChain;

		if (!paraXcAssets || paraXcAssets.length === 0) {
			throw new BaseError(
				`unable to initialize xcAssets registry for ${currentRelayChainSpecName}`,
				BaseErrorsEnum.InvalidPallet
			);
		}

		if (_api.query.asset) {
			if (!assetIsValidInt) {
				// if not assetHub and assetId isnt a number, query the parachain chain for the asset symbol
				const parachainAssets = await _api.query.assets.asset.entries();
	
				for (let i = 0; i < parachainAssets.length; i++) {
					const parachainAsset = parachainAssets[i];
					const id = parachainAsset[0].args[0];
	
					const metadata = await _api.query.assets.metadata(id);
					if (metadata.symbol.toHuman()?.toString().toLowerCase() === asset.toLowerCase()) {
						assetId = id.toString();
						// add queried asset to registry
						registry.setAssetInCache(assetId, asset);
						break;
					}
				}

				// if assetId length is 0, check xcAssets for symbol
				if (assetId.length === 0) {
					for (const info of paraXcAssets) {
						if (
							typeof info.asset === 'string' &&
							typeof info.symbol === 'string' &&
							info.symbol.toLowerCase() === asset.toLowerCase()
						) {
							assetId = info.asset;
							registry.setAssetInCache(assetId, asset);
							break;
						}
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

		} else {
			console.log('AM I REACHED?????');
			// Pallet Assets isn't supported, check symbol or integer assetId against asset registry
			if (assetIsValidInt) {
				for (const info of paraXcAssets) {
					if (typeof info.asset === 'string' && info.asset.toLowerCase() === asset.toLowerCase()) {
						assetId = info.xcmV1MultiLocation;
						registry.setAssetInCache(assetId, asset);
					}
				}
			} else {
				for (const info of paraXcAssets) {
					console.log('ASSET ID', info.symbol);
					if (
						typeof info.symbol === 'string' && 
						info.symbol.toLowerCase() === asset.toLowerCase()
					) {
						assetId = info.xcmV1MultiLocation;
						registry.setAssetInCache(assetId, asset);
					} else if (
						typeof info.symbol === 'string' && 
						info.symbol.toLowerCase() === asset.toLowerCase()
					) {
						assetId = info.xcmV1MultiLocation;
						registry.setAssetInCache(assetId, asset);
					}
				}
			}

			console.log('WHAT IS SPECNAME', specName);
			console.log('WHAT IS ASSET ID', assetId);
			if (assetId.length === 0) {
				throw new BaseError(
					`parachain assetId ${asset} is not a valid symbol assetIid in ${specName}`,
					BaseErrorsEnum.InvalidAsset
				);
			}
		}
	}

	return assetId;
};
