// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApiV1016000 } from './mockRelayApiV1016000.js';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApiV1016000.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApiV1016000.registry.createType('Text', 'westend'),
			specVersion: mockRelayApiV1016000.registry.createType('u32', 1014000),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApiV1016000.registry.createType('Header', {
			number: mockRelayApiV1016000.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApiV1016000.registry.createType('Hash'),
			stateRoot: mockRelayApiV1016000.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApiV1016000.registry.createType('Hash'),
			digest: mockRelayApiV1016000.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApiV1016000.registry.createType('u32', 10);

export const adjustedMockRelayApiV1016000 = {
	registry: mockRelayApiV1016000.registry,
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
			limitedReserveTransferAssets: mockRelayApiV1016000.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApiV1016000.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApiV1016000.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApiV1016000.tx['xcmPallet'].limitedTeleportAssets,
			transferAssets: mockRelayApiV1016000.tx['xcmPallet'].transferAssets,
			claimAssets: mockRelayApiV1016000.tx['xcmPallet'].claimAssets,
			transferAssetsUsingTypeAndThen: mockRelayApiV1016000.tx['xcmPallet'].transferAssetsUsingTypeAndThen,
		},
		balances: {
			transfer: mockRelayApiV1016000.tx.balances.transfer,
			transferKeepAlive: mockRelayApiV1016000.tx.balances.transferKeepAlive,
			transferAll: mockRelayApiV1016000.tx.balances.transferAll,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApiV1016000.registry.createType('u32', 24),
		specVersion: mockRelayApiV1016000.registry.createType('u32', 1014000),
	},
	genesisHash: mockRelayApiV1016000.registry.createType('BlockHash'),
} as unknown as ApiPromise;
