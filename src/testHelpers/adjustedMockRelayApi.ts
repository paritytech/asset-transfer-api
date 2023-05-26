// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { mockRelayApi } from './mockRelayApi';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApi.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApi.registry.createType('Text', 'polkadot'),
			specVersion: mockRelayApi.registry.createType('u32', 9370),
		};
	});

export const adjustedMockRelayApi = {
	registry: mockRelayApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getRelayRuntimeVersion,
		},
	},
	query: {
		paras: {},
		xcmPallet: {
			safeXcmVersion: getRelaySafeXcmVersion,
		},
	},
	tx: {
		xcmPallet: {
			limitedReserveTransferAssets:
				mockRelayApi.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApi.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApi.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApi.tx['xcmPallet'].limitedTeleportAssets,
		},
	},
} as unknown as ApiPromise;
