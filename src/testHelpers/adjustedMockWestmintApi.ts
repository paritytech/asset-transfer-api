// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { mockWeightInfo } from './mockWeightInfo';
import { mockWestmintApi } from './mockWestmintApi';

const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockWestmintApi.registry.createType('Text', 'statemint'),
			specVersion: mockWestmintApi.registry.createType('u32', 9370),
		};
	});

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockWestmintApi.registry.createType('Option<u32>', 2);
	});

const queryInfoCallAt = () =>
	Promise.resolve().then(() =>
		mockWestmintApi.createType('RuntimeDispatchInfoV2', mockWeightInfo)
	);

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockWestmintApi = {
	registry: mockWestmintApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getSystemRuntimeVersion,
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
				mockWestmintApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockWestmintApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockWestmintApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockWestmintApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
		assets: {
			transfer: mockWestmintApi.tx.assets.transfer,
			transferKeepAlive: mockWestmintApi.tx.assets.transferKeepAlive,
		},
	},
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
} as unknown as ApiPromise;
