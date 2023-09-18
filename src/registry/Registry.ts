import { ASSET_HUB_CHAIN_ID } from '../consts';
import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import type { AssetTransferApiOpts } from '../types';
import { findRelayChain, parseRegistry } from './';
import type { ChainInfo, ChainInfoRegistry, ExpandedChainInfoKeys, ForeignAssetsData, RelayChains } from './types';

export class Registry {
	readonly specName: string;
	readonly registry: ChainInfoRegistry;
	readonly relayChain: RelayChains;
	readonly currentRelayRegistry: ChainInfo;
	cache: ChainInfoRegistry;

	constructor(specName: string, opts: AssetTransferApiOpts) {
		this.specName = specName;
		this.registry = parseRegistry(opts);
		this.relayChain = findRelayChain(this.specName, this.registry);
		this.currentRelayRegistry = this.registry[this.relayChain];
		this.cache = {
			polkadot: {},
			kusama: {},
			westend: {},
		};
		this.initializeAssetHubCache();
		this.initializeCurrentChainIdCache();
	}

	/**
	 * Initialize the cache for the current chain that is connected
	 */
	private initializeCurrentChainIdCache() {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		if (!this.cache[this.relayChain][currentChainId]) {
			this.cache[this.relayChain][currentChainId] = {
				assetsInfo: {},
				poolPairsInfo: {},
				specName: '',
				tokens: [],
				foreignAssetsInfo: {},
			};
		}
	}
	/**
	 * Initialize the cache for AssetHub
	 */
	private initializeAssetHubCache() {
		if (!this.cache[this.relayChain][ASSET_HUB_CHAIN_ID]) {
			this.cache[this.relayChain][ASSET_HUB_CHAIN_ID] = {
				assetsInfo: {},
				poolPairsInfo: {},
				specName: '',
				tokens: [],
				foreignAssetsInfo: {},
			};
		}
	}

	/**
	 * Getter for the foreignAssetsInfo cache.
	 *
	 * @param assetKey string
	 */
	public cacheLookupForeignAsset(assetKey: string): ForeignAssetsData | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		const lookup = this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'];

		return lookup[assetKey] ? lookup[assetKey] : undefined;
	}

	/**
	 * Setter for the foreignAssetsInfo cache.
	 *
	 * @param assetKey string
	 * @param assetValue ForeignAssetData
	 */
	public setForeignAssetInCache(assetKey: string, assetValue: ForeignAssetsData) {
		const currentChainId = getChainIdBySpecName(this, this.specName);

		this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'][assetKey] = assetValue;
	}

	/**
	 * Getter for the poolPairsInfo cache.
	 *
	 * @param assetKey string
	 */
	public cacheLookupPoolAsset(assetKey: string): { lpToken: string; pairInfo: string } | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		const lookup = this.cache[this.relayChain][currentChainId]['poolPairsInfo'];

		return lookup[assetKey] ? lookup[assetKey] : undefined;
	}

	/**
	 * Setter for the poolPairsInfo cache.
	 *
	 * @param assetKey string
	 * @param assetValue { lpToken: string; pairInfo: string }
	 */
	public setLiquidPoolTokenInCache(assetKey: string, assetValue: { lpToken: string; pairInfo: string }) {
		const currentChainId = getChainIdBySpecName(this, this.specName);

		this.cache[this.relayChain][currentChainId]['poolPairsInfo'][assetKey] = assetValue;
	}

	/**
	 * Getter for the assets cache.
	 *
	 * @param assetKey string
	 */
	public cacheLookupAsset(assetKey: string): string | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		const lookup = this.cache[this.relayChain][currentChainId]['assetsInfo'];

		return lookup[assetKey] ? lookup[assetKey] : undefined;
	}

	/**
	 * Setter for the assets cache.
	 *
	 * @param assetKey string
	 * @param assetValue string
	 */
	public setAssetInCache(assetKey: string, assetValue: string) {
		const currentChainId = getChainIdBySpecName(this, this.specName);

		this.cache[this.relayChain][currentChainId]['assetsInfo'][assetKey] = assetValue;
	}

	/**
	 * Getter for the complete registry.
	 */
	public get getRegistry() {
		return this.registry;
	}

	/**
	 * Getter for the name of the relay chain for this network.
	 */
	public get getRelayChain() {
		return this.relayChain;
	}

	/**
	 * Getter for the registry associated with this networks relay chain.
	 */
	public get getRelaysRegistry() {
		return this.currentRelayRegistry;
	}

	/**
	 * Lookup all chains that have the following token symbol. It will return an array
	 * with all the chains that have the following token symbols. Note this will only
	 * be searched in the respective relay chains registry.
	 *
	 * @param symbol Token symbol to lookup
	 */
	public lookupTokenSymbol(symbol: string): ExpandedChainInfoKeys[] {
		const chainIds = Object.keys(this.currentRelayRegistry);
		const result = [];

		for (let i = 0; i < chainIds.length; i++) {
			const chainInfo = this.currentRelayRegistry[chainIds[i]];
			if (chainInfo.tokens.includes(symbol)) {
				result.push(Object.assign({}, chainInfo, { chainId: chainIds[i] }));
			}
		}

		return result;
	}

	/**
	 * Lookup all chains that have the following assetId. It will return an array
	 * with all the chains that have the following AssetId. Note this will only
	 * be searched in the respective relay chains registry.
	 *
	 * @param id AssetId to lookup
	 */
	public lookupAssetId(id: string) {
		const chainIds = Object.keys(this.currentRelayRegistry);
		const result = [];

		for (let i = 0; i < chainIds.length; i++) {
			const chainInfo = this.currentRelayRegistry[chainIds[i]];
			if (Object.keys(chainInfo.assetsInfo).includes(id)) {
				result.push(Object.assign({}, chainInfo, { chainId: chainIds[i] }));
			}
		}

		return result;
	}

	/**
	 * Check whether a parachain id exists within the relay chains registry.
	 *
	 * @param id Id of the parachain
	 */
	public lookupParachainId(id: string): boolean {
		const chainIds = Object.keys(this.currentRelayRegistry);
		if (chainIds.includes(id)) return true;

		return false;
	}

	/**
	 * Return the info for a parachain within a relay chains registry.
	 *
	 * @param id
	 */
	public lookupParachainInfo(id: string): ExpandedChainInfoKeys[] {
		const chainIds = Object.keys(this.currentRelayRegistry);
		if (chainIds.includes(id)) {
			return [Object.assign({}, this.currentRelayRegistry[id], { chainId: id })];
		}
		return [];
	}
}
