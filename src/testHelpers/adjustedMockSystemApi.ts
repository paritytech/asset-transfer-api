// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { Metadata, Option, TypeRegistry } from '@polkadot/types';
import type { Header, MultiLocation } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup';
import { getSpecTypes } from '@polkadot/types-known';

import { assetHubWestendV9435 } from './metadata/assetHubWestendV9435';
import { mockSystemApi } from './mockSystemApi';
import { mockWeightInfo } from './mockWeightInfo';
/**
 * Create a type registry for Statemine.
 * Useful for creating types in order to facilitate testing.
 *
 * @param specVersion Statemine runtime spec version to get type defs for.
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

	registry.setMetadata(new Metadata(registry, assetHubWestendV9435));

	return registry;
}
const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockSystemApi.registry.createType('Text', 'asset-hub-westend'),
			specVersion: mockSystemApi.registry.createType('u32', 9435),
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
		mockSystemApi.registry.createType('Metadata', assetHubWestendV9435)
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

const multiLocationAssetInfo = {
	owner: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543'
	),
	issuer: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543'
	),
	admin: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543'
	),
	freezer: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543'
	),
	supply: mockSystemApi.registry.createType('u128', 100),
	deposit: mockSystemApi.registry.createType('u128', 100),
	minBalance: mockSystemApi.registry.createType('u128', 100),
	isSufficient: mockSystemApi.registry.createType('bool', true),
	accounts: mockSystemApi.registry.createType('u32', 100),
	sufficients: mockSystemApi.registry.createType('u32', 100),
	approvals: mockSystemApi.registry.createType('u32', 100),
	status: mockSystemApi.registry.createType('PalletAssetsAssetStatus', 'live'),
};

const asset = (assetId: number): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<number, PalletAssetsAssetDetails> = new Map();

		const insufficientAssetInfo = {
			owner: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			issuer: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			admin: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			freezer: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			supply: mockSystemApi.registry.createType('u128', 100),
			deposit: mockSystemApi.registry.createType('u128', 100),
			minBalance: mockSystemApi.registry.createType('u128', 100),
			isSufficient: mockSystemApi.registry.createType('bool', false),
			accounts: mockSystemApi.registry.createType('u32', 100),
			sufficients: mockSystemApi.registry.createType('u32', 100),
			approvals: mockSystemApi.registry.createType('u32', 100),
			status: mockSystemApi.registry.createType(
				'PalletAssetsAssetStatus',
				'live'
			),
		};
		const insufficientAsset = mockSystemApi.registry.createType(
			'PalletAssetsAssetDetails',
			insufficientAssetInfo
		);
		assets.set(100, insufficientAsset);

		const sufficientAsset = mockSystemApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo
		);
		assets.set(1984, sufficientAsset);

		const maybeAsset = assets.has(assetId) ? assets.get(assetId) : undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset
			);
		}

		return mockSystemApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined
		);
	});

const foreignAsset = (
	asset: MultiLocation
): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
		const multiLocation = mockSystemApi.registry.createType(
			'MultiLocation',
			JSON.parse(multiLocationStr)
		);
		const multiLocationAsset = mockSystemApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo
		);
		assets.set(multiLocation.toHex(), multiLocationAsset);

		const maybeAsset = assets.has(asset.toHex())
			? assets.get(asset.toHex())
			: undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset
			);
		}

		return mockSystemApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined
		);
	});

const poolAsset = (asset: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationAsset = mockSystemApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo
		);

		assets.set('0', multiLocationAsset);

		const maybeAsset = assets.has(asset) ? assets.get(asset) : undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset
			);
		}

		return mockSystemApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined
		);
	});

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockSystemApi = {
	createType: createType,
	registry: createStatemineRegistry(9435),
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
		assets: {
			asset: asset,
		},
		foreignAssets: {
			asset: foreignAsset,
		},
		poolAssets: {
			asset: poolAsset,
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
		foreignAssets: {
			transfer: mockSystemApi.tx.foreignAssets.transfer,
			transferKeepAlive: mockSystemApi.tx.foreignAssets.transferKeepAlive,
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
