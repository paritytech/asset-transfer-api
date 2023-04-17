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
	],
	westend: [],
};

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
	});

	await api.isReady;

	const { tokenSymbol } = await api.rpc.system.properties();
	const tokens = tokenSymbol.isSome
		? tokenSymbol
				.unwrap()
				.toArray()
				.map((token) => token.toString())
		: [];

	await api.disconnect();

	return {
		tokens,
		paraId,
	};
};

const createChainRegistryFromParas = async (
	chainName: ChainName,
	endpoints: Omit<EndpointOption, 'teleport'>[],
	registry: TokenRegistry
) => {
	for (const endpoint of endpoints) {
		const unreliable: boolean = (unreliableIds[chainName] as number[]).includes(
			endpoint.paraId as number
		);
		if (unreliable) {
			continue;
		}
		const res = await fetchChainInfo(endpoint);
		if (res !== null) {
			registry[chainName][`${res.paraId as number}`] = res;
		}

		console.log(registry);
	}
};

const createChainRegistryFromRelay = async (
	chainName: ChainName,
	endpoint: EndpointOption,
	registry: TokenRegistry
) => {
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

	await createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry);
	await createChainRegistryFromRelay('kusama', prodRelayKusama, registry);
	await createChainRegistryFromRelay('westend', testRelayWestend, registry);

	console.log(registry);

	for (const endpoints of polkadotEndpoints) {
		await createChainRegistryFromParas('polkadot', endpoints, registry);
	}

	for (const endpoints of kusamaEndpoints) {
		await createChainRegistryFromParas('kusama', endpoints, registry);
	}

	for (const endpoints of westendEndpoints) {
		await createChainRegistryFromParas('westend', endpoints, registry);
	}

	// Write registry to JSON file
	return registry;
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
