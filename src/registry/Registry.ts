import type { AssetsTransferApiOpts } from '../types';
import { findRelayChain, parseRegistry } from './';
import type {
	ChainInfo,
	ChainInfoRegistry,
	ExpandedChainInfoKeys,
	RelayChains,
} from './types';

export class Registry {
	readonly specName: string;
	readonly registry: ChainInfoRegistry;
	readonly relayChain: RelayChains;
	readonly currentRelayRegistry: ChainInfo;

	constructor(specName: string, opts: AssetsTransferApiOpts) {
		this.specName = specName;
		this.registry = parseRegistry(opts);
		this.relayChain = findRelayChain(this.specName, this.registry);
		this.currentRelayRegistry = this.registry[this.relayChain];
	}

	public get getRegistry() {
		return this.registry;
	}

	public get getRelayChain() {
		return this.relayChain;
	}

	public get getRelaysRegistry() {
		return this.currentRelayRegistry;
	}

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

	public lookupParachainId(id: string): boolean {
		const chainIds = Object.keys(this.currentRelayRegistry);
		if (chainIds.includes(id)) return true;

		return false;
	}

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
