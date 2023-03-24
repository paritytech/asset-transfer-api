// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { WsProvider } from '@polkadot/rpc-provider';

/**
 * Construct an Polkadot-js Api-Promise
 *
 * @param wsUrl WebSocket Url to connect to.
 * @param opts ApiOptions
 */
export const constructApiPromise = async (
	wsUrl: string,
	opts: ApiOptions = {}
): Promise<ApiPromise> => {
	return await ApiPromise.create({
		provider: new WsProvider(wsUrl),
		noInitWarn: true,
		...opts,
	});
};
