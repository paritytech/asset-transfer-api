// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';

import { Registry } from '../../registry';

type AssetHubEndPoints = {
	[key: string]: AssetHubRpc;
};
type AssetHubRpc =
	| 'wss://polkadot-asset-hub-rpc.polkadot.io'
	| 'wss://kusama-asset-hub-rpc.polkadot.io'
	| 'wss://westend-asset-hub-rpc.polkadot.io';

// short list of relay chain asset hub endpoints
const assetHubEndpoints: AssetHubEndPoints = {
	polkadot: 'wss://polkadot-asset-hub-rpc.polkadot.io',
	kusama: 'wss://kusama-asset-hub-rpc.polkadot.io',
	westend: 'wss://westend-asset-hub-rpc.polkadot.io',
};

export const constructAssetHubApiPromise = async (
	registry: Registry
): Promise<ApiPromise> => {
	const relaySpecName = registry.currentRelayRegistry['0'].specName;
	const assetHubEndpoint = assetHubEndpoints[relaySpecName];
	const provider = new WsProvider(assetHubEndpoint);

	// initialize the AssetHub API for querying foreign assets
	const api = await ApiPromise.create({
		provider,
		noInitWarn: true,
	});

	await api.isReady;

	return api;
};
