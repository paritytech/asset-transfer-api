// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { mockSystemApi } from './mockSystemApi';
import { mockWeightInfo } from './mockWeightInfo';

const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockSystemApi.registry.createType('Text', 'statemint'),
			specVersion: mockSystemApi.registry.createType('u32', 9370),
		};
	});

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockSystemApi.registry.createType('Option<u32>', 2);
	});

const queryInfoCallAt = () =>
	Promise.resolve().then(() =>
		mockSystemApi.createType('RuntimeDispatchInfoV2', mockWeightInfo)
	);

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockSystemApi = {
	registry: mockSystemApi.registry,
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
				mockSystemApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockSystemApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockSystemApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockSystemApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
		assets: {
			transfer: mockSystemApi.tx.assets.transfer,
			transferKeepAlive: mockSystemApi.tx.assets.transferKeepAlive,
		},
	},
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
} as unknown as ApiPromise;
