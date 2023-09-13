// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import type { ApiOptions } from '@polkadot/api/types';
import { WsProvider } from '@polkadot/rpc-provider';

import { fetchSafeXcmVersion } from './createXcmCalls/util/fetchSafeXcmVersion';

/**
 * the api promise, specName and safeXcmVersion for the currently connected rpc endpoint
 */
export interface ApiInfo {
	api: ApiPromise;
	specName: string;
	safeXcmVersion: number;
}

/**
 * Construct an Polkadot-js ApiPromise, and and retrieve the specName of the chain
 *
 * @param wsUrl WebSocket Url to connect to.
 * @param opts ApiOptions
 */
export const constructApiPromise = async (wsUrl: string, opts: ApiOptions = {}): Promise<ApiInfo> => {
	const api = await ApiPromise.create({
		provider: new WsProvider(wsUrl),
		noInitWarn: true,
		...opts,
	});
	await api.isReady;

	const { specName } = await api.rpc.state.getRuntimeVersion();
	const safeXcmVersion = await fetchSafeXcmVersion(api);

	return {
		api,
		specName: specName.toString(),
		safeXcmVersion: safeXcmVersion.toNumber(),
	};
};
