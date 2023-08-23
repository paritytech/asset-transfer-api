// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { ASSET_HUB_CHAIN_ID } from '../../consts';
import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { foreignAssetMultiLocationIsInRegistry } from './foreignAssetMultiLocationIsInRegistry';
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
	registry: Registry,
	asset: string,
	specName: string,
	isForeignAssetsTransfer?: boolean
): Promise<string> => {
	const currentChainId = getChainIdBySpecName(registry, specName);
	const parsedAssetAsNumber = Number.parseInt(asset);
	const assetIsNumber = !Number.isNaN(parsedAssetAsNumber);
	const isSystemChain =
		parseInt(currentChainId) < 2000 && parseInt(currentChainId) > 0;
	const isParachain = parseInt(currentChainId) >= 2000;

	// check the cache and return the cached assetId if found
	const cachedAssetId = registry.assetsCache[registry.relayChain][
		currentChainId
	]
		? registry.assetsCache[registry.relayChain][currentChainId]['assetsInfo'][
				asset
		  ]
		: undefined;

	if (cachedAssetId) {
		// if asset is in the registry cache, return the assetId
		return cachedAssetId;
	}

	// check the registry and return the assetId if found
	const { assetsInfo } = registry.currentRelayRegistry[currentChainId];
	if (isSystemChain) {
		if (Object.keys(assetsInfo).length === 0) {
			throw new BaseError(
				`${specName} has no associated token symbol ${asset}`
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

	if (isForeignAssetsTransfer) {
		// determine if we already have the multilocation in the registry
		const multiLocationIsInRegistry = foreignAssetMultiLocationIsInRegistry(
			_api,
			asset,
			registry
		);

		if (multiLocationIsInRegistry) {
			assetId = asset;
		} else {
			// TODO: create AssetHub ApiPromise to query chain state for foreign assets
		}
	} else if (isSystemChain) {
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
					// add queried asset to registry
					registry.assetsCache[registry.relayChain][currentChainId][
						'assetsInfo'
					][asset] = assetSymbol;
				}
			} else {
				throw new BaseError(`general index for assetId ${asset} was not found`);
			}
		} else {
			throw new BaseError(
				`assetId ${asset} is not a valid symbol or integer asset id for ${specName}`
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
					// add queried asset to registry
					registry.assetsCache[registry.relayChain][currentChainId][
						'assetsInfo'
					][assetId] = asset;
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
				// add queried asset to registry
				registry.assetsCache[registry.relayChain][currentChainId]['assetsInfo'][
					assetId
				] = asset;
			} else {
				throw new BaseError(
					`parachain assetId ${asset} is not a valid integer assetIid in ${specName}`
				);
			}
		}
	}

	return assetId;
};
