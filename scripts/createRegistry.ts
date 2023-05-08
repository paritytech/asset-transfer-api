// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import {
	prodParasKusama,
	prodParasKusamaCommon,
	prodParasPolkadot,
	prodParasPolkadotCommon,
	prodRelayKusama,
	prodRelayPolkadot,
	testParasWestend,
	testParasWestendCommon,
	testRelayWestend,
} from '@polkadot/apps-config';
import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import fs from 'fs';

type TokenRegistry = {
	polkadot: {};
	kusama: {};
	westend: {};
};

type ChainName = 'polkadot' | 'kusama' | 'westend';

const unreliableIds = {
	polkadot: [
		2038, // geminis
		2090, // Oak Tech
		2053, // omnibtc
		2018, // subdao
	],
	kusama: [
		2257, // aband
		2019, // kpron,
		2080, // loomNetwork
		2016, // sakura
		2018, // subgame
		2236, // zero
		2129, // Ice Network
	],
	westend: [],
};

/**
 * Write Json to a file path.
 *
 * @param path Path to write the json file too
 * @param data Data that will be written to file.
 */
const writeJson = (path: string, data: TokenRegistry): void => {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

/**
 * Fetch chain token and spec info.
 *
 * @param endpointOpts
 * @param isRelay
 */
const fetchChainInfo = async (
	endpointOpts: EndpointOption,
	isRelay?: boolean
) => {
	const { providers, paraId } = endpointOpts;
	// If no providers are present return an empty object
	if (Object.keys(endpointOpts.providers).length === 0) return null;
	// If a paraId is not present return an empty object;
	if (!paraId && !isRelay) return null;

	const wsUrls = Object.values(providers).filter(
		(url) => !url.startsWith('light')
	);

	const api = await ApiPromise.create({
		provider: new WsProvider(wsUrls),
		noInitWarn: true,
	});

	await api.isReady;

	const { tokenSymbol } = await api.rpc.system.properties();
	const { specName } = await api.rpc.state.getRuntimeVersion();
	const tokens = tokenSymbol.isSome
		? tokenSymbol
				.unwrap()
				.toArray()
				.map((token) => token.toString())
		: [];

	const specNameStr = specName.toString();
	const assetIds: number[] = [];

	if (specNameStr === 'statemine' || specNameStr === 'statemint') {
		const commonGoodAssetIds = await fetchCommonGoodParachainAssetIds(api);
		assetIds.push(...commonGoodAssetIds);
	}

	await api.disconnect();

	return {
		tokens,
		assetIds,
		specName: specNameStr,
	};
};

/**
 * This adds to the chain registry for each chain that is passed in.
 *
 * @param chainName Relay chain name
 * @param endpoints Endpoints we are going to iterate through, and query
 * @param registry Registry we want to add the info too
 */
const createChainRegistryFromParas = async (
	chainName: ChainName,
	endpoints: Omit<EndpointOption, 'teleport'>[],
	registry: TokenRegistry
): Promise<void> => {
	for (const endpoint of endpoints) {
		const unreliable: boolean = (unreliableIds[chainName] as number[]).includes(
			endpoint.paraId as number
		);
		if (unreliable) {
			continue;
		}
		const res = await fetchChainInfo(endpoint);
		if (res !== null) {
			registry[chainName][`${endpoint.paraId as number}`] = res;
		}
	}
};

/**
 * Similar to `createChainRegistryFromParas`, this will only add to the registry for a single chain,
 * in this case the relay chain.
 *
 * @param chainName Relay chain name
 * @param endpoint Endpoint we are going to fetch the info from
 * @param registry Registry we want to add the info too
 */
const createChainRegistryFromRelay = async (
	chainName: ChainName,
	endpoint: EndpointOption,
	registry: TokenRegistry
): Promise<void> => {
	const res = await fetchChainInfo(endpoint, true);
	console.log('Res result: ', res);
	if (res !== null) {
		registry[chainName]['0'] = res;
	}
};

const main = async () => {
	const registry = {
		polkadot: {},
		kusama: {},
		westend: {},
	};
	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];

	// Set the relay chain info to the registry
	await createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry);
	await createChainRegistryFromRelay('kusama', prodRelayKusama, registry);
	await createChainRegistryFromRelay('westend', testRelayWestend, registry);

	// Set the paras info to the registry
	for (const endpoints of polkadotEndpoints) {
		await createChainRegistryFromParas('polkadot', endpoints, registry);
	}

	for (const endpoints of kusamaEndpoints) {
		await createChainRegistryFromParas('kusama', endpoints, registry);
	}

	for (const endpoints of westendEndpoints) {
		await createChainRegistryFromParas('westend', endpoints, registry);
	}

	const path = __dirname + '/../../src/registry/registry.json';
	writeJson(path, registry);
};

const fetchCommonGoodParachainAssetIds = async (
	api: ApiPromise
): Promise<number[]> => {
	const keys = await api.query.assets.asset.keys();
	return keys.map(({ args: [assetId] }) => assetId.toNumber());
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
