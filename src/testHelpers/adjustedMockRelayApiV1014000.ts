// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockRelayApiV1014000 } from './mockRelayApiV1014000';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockRelayApiV1014000.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockRelayApiV1014000.registry.createType('Text', 'westend'),
			specVersion: mockRelayApiV1014000.registry.createType('u32', 1014000),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockRelayApiV1014000.registry.createType('Header', {
			number: mockRelayApiV1014000.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockRelayApiV1014000.registry.createType('Hash'),
			stateRoot: mockRelayApiV1014000.registry.createType('Hash'),
			extrinsicsRoot: mockRelayApiV1014000.registry.createType('Hash'),
			digest: mockRelayApiV1014000.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockRelayApiV1014000.registry.createType('u32', 10);

export const adjustedMockRelayApiV1014000 = {
	registry: mockRelayApiV1014000.registry,
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
			limitedReserveTransferAssets: mockRelayApiV1014000.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets: mockRelayApiV1014000.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockRelayApiV1014000.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets: mockRelayApiV1014000.tx['xcmPallet'].limitedTeleportAssets,
			transferAssets: mockRelayApiV1014000.tx['xcmPallet'].transferAssets,
			claimAssets: mockRelayApiV1014000.tx['xcmPallet'].claimAssets,
			transferAssetsUsingTypeAndThen: mockRelayApiV1014000.tx['xcmPallet'].transferAssetsUsingTypeAndThen,
		},
		balances: {
			transfer: mockRelayApiV1014000.tx.balances.transfer,
			transferKeepAlive: mockRelayApiV1014000.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockRelayApiV1014000.registry.createType('u32', 24),
		specVersion: mockRelayApiV1014000.registry.createType('u32', 1014000),
	},
	genesisHash: mockRelayApiV1014000.registry.createType('BlockHash'),
} as unknown as ApiPromise;
