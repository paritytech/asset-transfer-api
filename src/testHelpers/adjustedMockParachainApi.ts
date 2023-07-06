// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';

import { mockParachainApi } from './mockParachainApi';

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockParachainApi.registry.createType('Option<u32>', 2);
	});

const getParachainRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockParachainApi.registry.createType('Text', 'moonriver'),
			specVersion: mockParachainApi.registry.createType('u32', 2302),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockParachainApi.registry.createType('Header', {
			number: mockParachainApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockParachainApi.registry.createType('Hash'),
			stateRoot: mockParachainApi.registry.createType('Hash'),
			extrinsicsRoot: mockParachainApi.registry.createType('Hash'),
			digest: mockParachainApi.registry.createType('Digest'),
		})
	);

const accountNextIndex = () => mockParachainApi.registry.createType('u32', 10);

export const adjustedMockParachainApi = {
	registry: mockParachainApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getParachainRuntimeVersion,
		},
		system: {
			accountNextIndex: accountNextIndex,
		},
		chain: {
			getHeader: getHeader,
		},
	},
	query: {
		polkadotXcm: {
			safeXcmVersion: getSystemSafeXcmVersion,
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets:
				mockParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockParachainApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockParachainApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
	},
	runtimeVersion: {
		transactionVersion: mockParachainApi.registry.createType('u32', 4),
		specVersion: mockParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
