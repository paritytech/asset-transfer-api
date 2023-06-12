// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { Compact } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import { mockSystemApi } from './mockSystemApi';
import { mockWeightInfo } from './mockWeightInfo';
import { statemineV9420 } from './metadata/statemineV9420';

const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockSystemApi.registry.createType('Text', 'statemine'),
			specVersion: mockSystemApi.registry.createType('u32', 9420),
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

const getMetadata = () => Promise.resolve().then(() => mockSystemApi.registry.createType('Metadata', statemineV9420));

const getHeader = (): Promise<{ number: Compact<BlockNumber> }> =>
	Promise.resolve().then(() => {
		return {
			number: mockSystemApi.registry.createType('Compact<BlockNumber>', 100),
		};
	});

const createType = mockSystemApi.registry.createType.bind(mockSystemApi);

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockSystemApi = {
	createType: createType,
	registry: mockSystemApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getSystemRuntimeVersion,
			getMetadata: getMetadata
		},
		chain: {
			getHeader: getHeader
		}
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
		balances: {
			transfer: mockSystemApi.tx.balances.transfer,
			transferKeepAlive: mockSystemApi.tx.balances.transferKeepAlive,
		},
	},
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
} as unknown as ApiPromise;
