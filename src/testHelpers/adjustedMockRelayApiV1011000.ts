// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApiV1011000 } from './mockRelayApiV1011000';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApiV1011000.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApiV1011000.registry.createType('Text', 'westend'),
			specVersion: mockRelayApiV1011000.registry.createType('u32', 1007001),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApiV1011000.registry.createType('Header', {
			number: mockRelayApiV1011000.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApiV1011000.registry.createType('Hash'),
			stateRoot: mockRelayApiV1011000.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApiV1011000.registry.createType('Hash'),
			digest: mockRelayApiV1011000.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApiV1011000.registry.createType('u32', 10);

export const adjustedMockRelayApiV1011000 = {
	registry: mockRelayApiV1011000.registry,
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
			limitedReserveTransferAssets: mockRelayApiV1011000.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApiV1011000.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApiV1011000.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApiV1011000.tx['xcmPallet'].limitedTeleportAssets,
			transferAssets: mockRelayApiV1011000.tx['xcmPallet'].transferAssets,
			claimAssets: mockRelayApiV1011000.tx['xcmPallet'].claimAssets,
			transferAssetsUsingTypeAndThen: mockRelayApiV1011000.tx['xcmPallet'].transferAssetsUsingTypeAndThen,
		},
		balances: {
			transfer: mockRelayApiV1011000.tx.balances.transfer,
			transferKeepAlive: mockRelayApiV1011000.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApiV1011000.registry.createType('u32', 24),
		specVersion: mockRelayApiV1011000.registry.createType('u32', 1007001),
	},
	genesisHash: mockRelayApiV1011000.registry.createType('BlockHash'),
} as unknown as ApiPromise;
