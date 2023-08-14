// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { StorageKey, u32, Option, Metadata, TypeRegistry } from '@polkadot/types';
import type { Header } from '@polkadot/types/interfaces';
import { getSpecTypes } from '@polkadot/types-known';
import { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';

import { mockParachainApi } from './mockParachainApi';
import { moonriverV2302 } from './metadata/moonriverV2302';


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
// /**
//  * Create a type registry for Moonriver.
//  * Useful for creating types in order to facilitate testing.
//  *
//  * @param specVersion Moonriver runtime spec version to get type defs for.
//  */
function createMoonriverRegistry(specVersion: number): TypeRegistry {
	const registry = new TypeRegistry();

	registry.setChainProperties(
		registry.createType('ChainProperties', {
			ss58Format: 2,
			tokenDecimals: 12,
			tokenSymbol: 'MOVR',
		})
	);

	registry.register(
		getSpecTypes(registry, 'Moonriver', 'moonriver', specVersion)
	);

	registry.setMetadata(new Metadata(registry, moonriverV2302));

	return registry;
}
const accountNextIndex = () => mockParachainApi.registry.createType('u32', 10);
const asset = (assetId: number): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<number, PalletAssetsAssetDetails> = new Map();

		const assetInfo = {
			owner: mockParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			issuer: mockParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			admin: mockParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			freezer: mockParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543'
			),
			supply: mockParachainApi.registry.createType('u128', 100),
			deposit: mockParachainApi.registry.createType('u128', 100),
			minBalance: mockParachainApi.registry.createType('u128', 100),
			isSufficient: mockParachainApi.registry.createType('bool', true),
			accounts: mockParachainApi.registry.createType('u32', 100),
			sufficients: mockParachainApi.registry.createType('u32', 100),
			approvals: mockParachainApi.registry.createType('u32', 100),
			status: mockParachainApi.registry.createType(
				'PalletAssetsAssetStatus',
				'live'
			),
		};
		const asset = mockParachainApi.registry.createType(
			'PalletAssetsAssetDetails',
			assetInfo
		);
		assets.set(10, asset);

		const maybeAsset = assets.has(assetId) ? assets.get(assetId) : undefined;

		if (maybeAsset) {
			return new Option(
				createMoonriverRegistry(2302),
				'PalletAssetsAssetDetails',
				maybeAsset
			);
		}

		return mockParachainApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined
		);
	});

	const metadata = (assetId: number): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<number, PalletAssetsAssetMetadata> = new Map();

		const rawXcKsmMetadata = {
			deposit: mockParachainApi.registry.createType('u128', 0),
			name: mockParachainApi.registry.createType('Bytes', "0x78634b534d"),
			symbol: Object.assign(mockParachainApi.registry.createType('Bytes', "0x78634b534d"), {
				toHuman: () => 'xcKSM'
			}),
			decimals: mockParachainApi.registry.createType('u8', 12),
			isFrozen: mockParachainApi.registry.createType('bool', false)
		};
		const xcKsmMetadata = mockParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXcKsmMetadata
		);
		metadata.set(10, xcKsmMetadata);
		
		const rawXcUsdtMetadata = {
			deposit: mockParachainApi.registry.createType('u128', 0),
			name: mockParachainApi.registry.createType('Bytes', "0x54657468657220555344"),
			symbol: Object.assign(mockParachainApi.registry.createType('Bytes', "0x786355534454"), {
				toHuman: () => 'xcUSDT'
			}),
			decimals: mockParachainApi.registry.createType('u8', 6),
			isFrozen: mockParachainApi.registry.createType('bool', false)
		}
		const xcUsdtMetadata = mockParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXcUsdtMetadata
		);
		metadata.set(20, xcUsdtMetadata);

		const maybeMetadata = metadata.has(assetId) ? metadata.get(assetId) : undefined;
		
		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			{}
		);
	});

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
		assets: {
			asset: Object.assign(asset,{
				entries: async () => {
					const metadata: Map<number, PalletAssetsAssetMetadata> = new Map();

					const rawXcKsmMetadata = {
						deposit: mockParachainApi.registry.createType('u128', 0),
						name: mockParachainApi.registry.createType('Bytes', "0x78634b534d"),
						symbol: Object.assign(mockParachainApi.registry.createType('Bytes', "0x78634b534d"), {
							toHuman: () => 'xcKSM'
						}),
						decimals: mockParachainApi.registry.createType('u8', 12),
						isFrozen: mockParachainApi.registry.createType('bool', false)
					};
					const xcKsmMetadata = mockParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXcKsmMetadata
					);
					metadata.set(10, xcKsmMetadata);
					
					const rawXcUsdtMetadata = {
						deposit: mockParachainApi.registry.createType('u128', 0),
						name: mockParachainApi.registry.createType('Bytes', "0x54657468657220555344"),
						symbol: Object.assign(mockParachainApi.registry.createType('Bytes', "0x786355534454"), {
							toHuman: () => 'xcUSDT'
						}),
						decimals: mockParachainApi.registry.createType('u8', 6),
						isFrozen: mockParachainApi.registry.createType('bool', false)
					}
					const xcUsdtMetadata = mockParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXcUsdtMetadata
					);
					metadata.set(20, xcUsdtMetadata);
					
					const result: [StorageKey<[u32]>, PalletAssetsAssetMetadata][] = [];
					metadata.forEach((val, key) => {
						const assetIdU32 = mockParachainApi.registry.createType('u32', key);
						const storageKey = {args: [assetIdU32]} as StorageKey<[u32]>;

						result.push([storageKey, val]);
					})

					return result;
				}
			}),
			metadata: metadata
		}
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
		xTokens: {
			transferMultiasset: mockParachainApi.tx['xTokens'].transferMultiasset,
			transferMultiassetWithFee:
				mockParachainApi.tx['xTokens'].transferMultiassetWithFee,
			transferMultiassets: mockParachainApi.tx['xTokens'].transferMultiassets,
		},
	},
	runtimeVersion: {
		transactionVersion: mockParachainApi.registry.createType('u32', 4),
		specVersion: mockParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
