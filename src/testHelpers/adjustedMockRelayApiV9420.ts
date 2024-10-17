// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApiV9420 } from './mockRelayApiV9420.js';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApiV9420.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApiV9420.registry.createType('Text', 'kusama'),
			specVersion: mockRelayApiV9420.registry.createType('u32', 9420),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApiV9420.registry.createType('Header', {
			number: mockRelayApiV9420.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApiV9420.registry.createType('Hash'),
			stateRoot: mockRelayApiV9420.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApiV9420.registry.createType('Hash'),
			digest: mockRelayApiV9420.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApiV9420.registry.createType('u32', 10);

export const adjustedMockRelayApi = {
	registry: mockRelayApiV9420.registry,
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
			limitedReserveTransferAssets: mockRelayApiV9420.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApiV9420.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApiV9420.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApiV9420.tx['xcmPallet'].limitedTeleportAssets,
		},
		balances: {
			transfer: mockRelayApiV9420.tx.balances.transfer,
			transferKeepAlive: mockRelayApiV9420.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApiV9420.registry.createType('u32', 4),
		specVersion: mockRelayApiV9420.registry.createType('u32', 9420),
	},
	genesisHash: mockRelayApiV9420.registry.createType('BlockHash'),
} as unknown as ApiPromise;
