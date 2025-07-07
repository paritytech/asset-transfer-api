import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';

import { ASSET_HUB_CHAIN_ID, MIN_PARACHAIN_ID } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { Registry } from '../../registry/index.js';
import { validateNumber } from '../../validate/index.js';
import { XcmCreator, XcmMultiLocation } from '../types.js';
import { assetIdIsLocation } from './assetIdIsLocation.js';
import { foreignAssetMultiLocationIsInCacheOrRegistry } from './foreignAssetMultiLocationIsInCacheOrRegistry.js';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists.js';

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
export const getAssetId = async ({
	api,
	registry,
	asset,
	specName,
	xcmCreator,
	isForeignAssetsTransfer,
}: {
	api: ApiPromise;
	registry: Registry;
	asset: string;
	specName: string;
	xcmCreator: XcmCreator;
	isForeignAssetsTransfer?: boolean;
}): Promise<string> => {
	const currentChainId = registry.lookupChainIdBySpecName(specName);
	const assetIsValidInt = validateNumber(asset);
	const isParachain = new BN(currentChainId).gte(new BN(MIN_PARACHAIN_ID));

	// if assets pallet, check the cache and return the cached assetId if found
	if (!isForeignAssetsTransfer) {
		const cachedAsset = registry.cacheLookupAsset(asset);

		if (cachedAsset) {
			// if asset is in the registry cache, return the cached asset
			return cachedAsset;
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
			(key) => assetsInfo[key].toLowerCase() === asset.toLowerCase(),
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
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(asset, registry, xcmCreator);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			const isValidForeignAsset = await foreignAssetsMultiLocationExists(api, registry, asset);

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
			const maybeAsset = await api.query.assets.asset(asset);

			if (maybeAsset.isSome) {
				assetId = asset;
				const assetMetadata = await api.query.assets.metadata(asset);
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
				`assetId ${asset} is not a valid symbol, integer asset id or location for ${specName}`,
				BaseErrorsEnum.InvalidAsset,
			);
		}
	} else if (isParachain) {
		const paraId = registry.lookupChainIdBySpecName(specName);
		const paraXcAssets = registry.getRelaysRegistry[paraId].xcAssetsData;
		const currentRelayChainSpecName = registry.relayChain;

		if (!paraXcAssets || paraXcAssets.length === 0) {
			throw new BaseError(
				`unable to initialize xcAssets registry for ${currentRelayChainSpecName}`,
				BaseErrorsEnum.InvalidPallet,
			);
		}

		if (api.query.assets) {
			if (!assetIsValidInt) {
				// if not assetHub and assetId isnt a number, query the parachain for the asset symbol
				const parachainAssets = await api.query.assets.asset.entries();

				for (let i = 0; i < parachainAssets.length; i++) {
					const parachainAsset = parachainAssets[i];
					const id = parachainAsset[0].args[0];

					const metadata = await api.query.assets.metadata(id);
					if (metadata.symbol.toHuman()?.toString().toLowerCase() === asset.toLowerCase()) {
						assetId = id.toString();
						// add queried asset to registry
						registry.setAssetInCache(asset, assetId);
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
							assetId = info.xcmV1MultiLocation;
							registry.setAssetInCache(asset, assetId);
							break;
						}
					}
				}

				if (assetId.length === 0) {
					throw new BaseError(
						`parachain assetId ${asset} is not a valid symbol assetIid in ${specName}`,
						BaseErrorsEnum.InvalidAsset,
					);
				}
			} else {
				// if not assetHub and assetId is a number, query the parachain for the asset
				const parachainAsset = await api.query.assets.asset(asset);
				if (parachainAsset.isSome) {
					assetId = asset;
					// add queried asset to registry
					registry.setAssetInCache(asset, assetId);
				} else {
					throw new BaseError(
						`parachain assetId ${asset} is not a valid integer assetIid in ${specName}`,
						BaseErrorsEnum.InvalidAsset,
					);
				}
			}
		} else {
			// Pallet Assets isn't supported, check symbol or integer assetId against asset registry
			if (assetIsValidInt) {
				for (const info of paraXcAssets) {
					if (typeof info.asset === 'string' && info.asset.toLowerCase() === asset.toLowerCase()) {
						assetId = info.xcmV1MultiLocation;
						registry.setAssetInCache(asset, assetId);
					}
				}
			} else {
				for (const info of paraXcAssets) {
					if (typeof info.symbol === 'string' && info.symbol.toLowerCase() === asset.toLowerCase()) {
						assetId = info.xcmV1MultiLocation;
						registry.setAssetInCache(asset, assetId);
					} else if (assetIdIsLocation({ assetId: asset, xcmCreator })) {
						const v1AssetLocation = JSON.parse(info.xcmV1MultiLocation) as XcmMultiLocation;

						if ('v1' in v1AssetLocation) {
							const registryAssetLocation = xcmCreator.resolveMultiLocation(JSON.stringify(v1AssetLocation.v1));
							const assetLocation = xcmCreator.resolveMultiLocation(asset);

							if (JSON.stringify(registryAssetLocation).toLowerCase() === JSON.stringify(assetLocation).toLowerCase()) {
								assetId = info.xcmV1MultiLocation;
								registry.setAssetInCache(asset, assetId);
							}
						}
					}
				}
			}

			if (assetId.length === 0) {
				throw new BaseError(
					`parachain assetId ${asset} is not a valid symbol assetId in ${specName}`,
					BaseErrorsEnum.InvalidAsset,
				);
			}
		}
	}

	return assetId;
};
