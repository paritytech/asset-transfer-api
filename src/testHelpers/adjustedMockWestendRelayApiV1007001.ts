// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApiV1007001 } from './mockRelayApiV1007001';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApiV1007001.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApiV1007001.registry.createType('Text', 'westend'),
			specVersion: mockRelayApiV1007001.registry.createType('u32', 1007001),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApiV1007001.registry.createType('Header', {
			number: mockRelayApiV1007001.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApiV1007001.registry.createType('Hash'),
			stateRoot: mockRelayApiV1007001.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApiV1007001.registry.createType('Hash'),
			digest: mockRelayApiV1007001.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApiV1007001.registry.createType('u32', 10);

export const adjustedMockWestendRelayApiV1007001 = {
	registry: mockRelayApiV1007001.registry,
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
			limitedReserveTransferAssets: mockRelayApiV1007001.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApiV1007001.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApiV1007001.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApiV1007001.tx['xcmPallet'].limitedTeleportAssets,
			transferAssets: mockRelayApiV1007001.tx['xcmPallet'].transferAssets,
		},
		balances: {
			transfer: mockRelayApiV1007001.tx.balances.transfer,
			transferKeepAlive: mockRelayApiV1007001.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApiV1007001.registry.createType('u32', 24),
		specVersion: mockRelayApiV1007001.registry.createType('u32', 1007001),
	},
	genesisHash: mockRelayApiV1007001.registry.createType('BlockHash'),
} as unknown as ApiPromise;
