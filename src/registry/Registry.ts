// Copyright 2023 Parity Technologies (UK) Ltd.

import registry from '@substrate/asset-transfer-api-registry';

import {
	ASSET_HUB_CHAIN_ID,
	KUSAMA_ASSET_HUB_SPEC_NAMES,
	POLKADOT_ASSET_HUB_SPEC_NAMES,
	ROCOCO_ASSET_HUB_SPEC_NAME,
	WESTEND_ASSET_HUB_SPEC_NAMES,
} from '../consts';
import type { AssetTransferApiOpts } from '../types';
import { findRelayChain, parseRegistry } from './';
import type {
	ChainInfo,
	ChainInfoKeys,
	ChainInfoRegistry,
	ExpandedChainInfoKeys,
	ForeignAssetsData,
	RelayChains,
} from './types';

export class Registry {
	readonly specName: string;
	readonly relayChain: RelayChains;
	readonly currentRelayRegistry: ChainInfo<ChainInfoKeys>;
	readonly opts: AssetTransferApiOpts<ChainInfoKeys>;
	public specNameToIdCache: Map<string, string>;
	public registry: ChainInfoRegistry<ChainInfoKeys>;
	public cache: ChainInfoRegistry<ChainInfoKeys>;

	constructor(specName: string, opts: AssetTransferApiOpts<ChainInfoKeys>) {
		this.opts = opts;
		this.specName = specName;
		this.registry = parseRegistry(registry as ChainInfoRegistry<ChainInfoKeys>, opts);
		this.relayChain = findRelayChain(this.specName, this.registry, this.opts.chainName);
		this.currentRelayRegistry = this.registry[this.relayChain];
		this.specNameToIdCache = new Map<string, string>();
		this.cache = {
			polkadot: {},
			kusama: {},
			westend: {},
			rococo: {},
		};
		this.initializeAssetHubCache();
		this.initializeCurrentChainIdCache();
	}

	/**
	 * Initialize the cache for the current chain that is connected
	 */
	private initializeCurrentChainIdCache() {
		const currentChainId = this.lookupChainIdBySpecName(this.specName);
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
		const currentChainId = this.lookupChainIdBySpecName(this.specName);
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
		const currentChainId = this.lookupChainIdBySpecName(this.specName);

		this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'][assetKey] = assetValue;
	}

	/**
	 * Getter for the poolPairsInfo cache.
	 *
	 * @param assetKey string
	 */
	public cacheLookupPoolAsset(assetKey: string): { lpToken: string; pairInfo: string } | undefined {
		const currentChainId = this.lookupChainIdBySpecName(this.specName);
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
		const currentChainId = this.lookupChainIdBySpecName(this.specName);

		this.cache[this.relayChain][currentChainId]['poolPairsInfo'][assetKey] = assetValue;
	}

	/**
	 * Getter for the assets cache.
	 *
	 * @param assetKey string
	 */
	public cacheLookupAsset(assetKey: string): string | undefined {
		const currentChainId = this.lookupChainIdBySpecName(this.specName);
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
		const currentChainId = this.lookupChainIdBySpecName(this.specName);

		this.cache[this.relayChain][currentChainId]['assetsInfo'][assetKey] = assetValue;
	}

	/**
	 * Set the registry.
	 *
	 * @param reg Registry
	 */
	public set setRegistry(reg: ChainInfoRegistry<ChainInfoKeys>) {
		this.registry = parseRegistry(reg, this.opts);
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
			if (chainInfo.tokens && chainInfo.tokens.includes(symbol)) {
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
	public lookupAssetId(id: string): (ChainInfoKeys & {
		chainId: string;
	})[] {
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
	 * @param id ParaId
	 */
	public lookupParachainInfo(id: string): ExpandedChainInfoKeys[] {
		const chainIds = Object.keys(this.currentRelayRegistry);
		if (chainIds.includes(id)) {
			return [Object.assign({}, this.currentRelayRegistry[id], { chainId: id })];
		}
		return [];
	}

	/**
	 * Return the Id of a chain given its specName.
	 *
	 * @param specName
	 */
	public lookupChainIdBySpecName(specName: string): string {
		if (this.specNameToIdCache.has(specName)) {
			return this.specNameToIdCache.get(specName) as string;
		}

		if (
			POLKADOT_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
			KUSAMA_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
			WESTEND_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
			ROCOCO_ASSET_HUB_SPEC_NAME.includes(specName.toLowerCase())
		) {
			this.specNameToIdCache.set(specName, '1000');
			return '1000';
		}

		const paraIds = Object.keys(this.currentRelayRegistry);
		for (let i = 0; i < paraIds.length; i++) {
			const id = paraIds[i];
			const chain = this.currentRelayRegistry[id];
			if (chain.specName && chain.specName.toLowerCase() === specName.toLowerCase()) {
				this.specNameToIdCache.set(specName, id);
				return id;
			}
		}

		return '';
	}
}
