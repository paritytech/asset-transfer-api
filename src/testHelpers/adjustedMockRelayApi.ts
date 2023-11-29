// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApi } from './mockRelayApi';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApi.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApi.registry.createType('Text', 'kusama'),
			specVersion: mockRelayApi.registry.createType('u32', 9420),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApi.registry.createType('Header', {
			number: mockRelayApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApi.registry.createType('Hash'),
			stateRoot: mockRelayApi.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApi.registry.createType('Hash'),
			digest: mockRelayApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApi.registry.createType('u32', 10);

export const adjustedMockRelayApi = {
	registry: mockRelayApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getRelayRuntimeVersion,
		},
		system: {
			accountNextIndex: accountNextIndex,
		},
		chain: {
			getHeader: getHeader,
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
			limitedReserveTransferAssets: mockRelayApi.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApi.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApi.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApi.tx['xcmPallet'].limitedTeleportAssets,
		},
		balances: {
			transfer: mockRelayApi.tx.balances.transfer,
			transferKeepAlive: mockRelayApi.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApi.registry.createType('u32', 4),
		specVersion: mockRelayApi.registry.createType('u32', 9420),
	},
	genesisHash: mockRelayApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
