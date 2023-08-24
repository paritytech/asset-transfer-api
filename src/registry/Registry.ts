import { getChainIdBySpecName } from '../createXcmTypes/util/getChainIdBySpecName';
import type { AssetsTransferApiOpts } from '../types';
import { findRelayChain, parseRegistry } from './';
import type {
	ChainInfo,
	ChainInfoRegistry,
	ExpandedChainInfoKeys,
	ForeignAssetsData,
	RelayChains,
	XCMChainInfoRegistry,
} from './types';

export class Registry {
	readonly specName: string;
	readonly registry: ChainInfoRegistry;
	readonly relayChain: RelayChains;
	readonly currentRelayRegistry: ChainInfo;
	readonly xcAssets: XCMChainInfoRegistry;
	cache: ChainInfoRegistry;

	constructor(specName: string, opts: AssetsTransferApiOpts) {
		this.specName = specName;
		this.registry = parseRegistry(opts);
		this.relayChain = findRelayChain(this.specName, this.registry);
		this.currentRelayRegistry = this.registry[this.relayChain];
		this.xcAssets = this.registry.xcAssets;
		this.cache = {
			polkadot: {},
			kusama: {},
			westend: {},
			xcAssets: {
				polkadot: [],
				kusama: [],
			},
		};
	}

	private initializeCurrentChainIdCache() {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		if (!this.cache[this.relayChain][currentChainId]) {
			this.cache[this.relayChain][currentChainId] = {
				assetsInfo: {},
				poolPairsInfo: {},
				foreignAssetsPalletInstance: null,
				assetsPalletInstance: null,
				specName: '',
				tokens: [],
				foreignAssetsInfo: {},
			};
		}
	}

	/**
	 * Getter for the foreignAssetsInfo cache.
	 *
	 * @param assetId string
	 */
	public cacheLookupForeignAsset(
		assetId: string
	): ForeignAssetsData | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		if (
			this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'][assetId]
		) {
			return this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'][
				assetId
			] as ForeignAssetsData;
		}

		return undefined;
	}

	/**
	 * Setter for the foreignAssetsInfo cache.
	 *
	 * @param assetId string
	 * @param asset ForeignAssetData
	 */
	public setForeignAssetInCache(assetId: string, asset: ForeignAssetsData) {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		this.cache[this.relayChain][currentChainId]['foreignAssetsInfo'][assetId] =
			asset;
	}

	/**
	 * Getter for the poolPairsInfo cache.
	 *
	 * @param assetId string
	 */
	public cacheLookupPoolAsset(
		assetId: string
	): { lpToken: string; pairInfo: string } | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		if (this.cache[this.relayChain][currentChainId]['poolPairsInfo'][assetId]) {
			return this.cache[this.relayChain][currentChainId]['poolPairsInfo'][
				assetId
			] as { lpToken: string; pairInfo: string };
		}

		return undefined;
	}

	/**
	 * Setter for the poolPairsInfo cache.
	 *
	 * @param assetId string
	 * @param asset { lpToken: string; pairInfo: string }
	 */
	public setLiquidPoolTokenInCache(
		assetId: string,
		asset: { lpToken: string; pairInfo: string }
	) {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		this.cache[this.relayChain][currentChainId]['poolPairsInfo'][assetId] =
			asset;
	}

	/**
	 * Getter for the assets cache.
	 *
	 * @param assetId string
	 */
	public cacheLookupAsset(assetId: string): string | undefined {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		if (this.cache[this.relayChain][currentChainId]['assetsInfo'][assetId]) {
			return this.cache[this.relayChain][currentChainId]['assetsInfo'][assetId];
		}

		return undefined;
	}

	/**
	 * Setter for the assets cache.
	 *
	 * @param assetId string
	 * @param asset string
	 */
	public setAssetInCache(assetId: string, asset: string) {
		const currentChainId = getChainIdBySpecName(this, this.specName);
		this.initializeCurrentChainIdCache();

		this.cache[this.relayChain][currentChainId]['assetsInfo'][assetId] = asset;
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
			return [
				Object.assign({}, this.currentRelayRegistry[id], { chainId: id }),
			];
		}
		return [];
	}
}
