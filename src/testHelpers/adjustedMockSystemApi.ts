// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { Header } from '@polkadot/types/interfaces';
import { getSpecTypes } from '@polkadot/types-known';

import { statemineV9420 } from './metadata/statemineV9420';
import { mockSystemApi } from './mockSystemApi';
import { mockWeightInfo } from './mockWeightInfo';
/**
 * Create a type registry for Kusama.
 * Useful for creating types in order to facilitate testing.
 *
 * @param specVersion Kusama runtime spec version to get type defs for.
 */
function createStatemineRegistry(specVersion: number): TypeRegistry {
	const registry = new TypeRegistry();

	registry.setChainProperties(
		registry.createType('ChainProperties', {
			ss58Format: 2,
			tokenDecimals: 12,
			tokenSymbol: 'KSM',
		})
	);

	registry.register(
		getSpecTypes(registry, 'Statemine', 'statemine', specVersion)
	);

	registry.setMetadata(new Metadata(registry, statemineV9420));

	return registry;
}
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

const getMetadata = () =>
	Promise.resolve().then(() =>
		mockSystemApi.registry.createType('Metadata', statemineV9420)
	);

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockSystemApi.registry.createType('Header', {
			number: mockSystemApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockSystemApi.registry.createType('Hash'),
			stateRoot: mockSystemApi.registry.createType('Hash'),
			extrinsicsRoot: mockSystemApi.registry.createType('Hash'),
			digest: mockSystemApi.registry.createType('Digest'),
		})
	);

const createType = mockSystemApi.registry.createType.bind(mockSystemApi);
const accountNextIndex = () => mockSystemApi.registry.createType('u32', 10);

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockSystemApi = {
	createType: createType,
	registry: createStatemineRegistry(9420),
	rpc: {
		state: {
			getRuntimeVersion: getSystemRuntimeVersion,
			getMetadata: getMetadata,
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
	runtimeVersion: {
		transactionVersion: mockSystemApi.registry.createType('u32', 4),
		specVersion: mockSystemApi.registry.createType('u32', 9420),
	},
	genesisHash: mockSystemApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
