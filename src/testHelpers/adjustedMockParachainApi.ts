// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import { Metadata, Option, StorageKey, TypeRegistry, u128 } from '@polkadot/types';
import type { Header } from '@polkadot/types/interfaces';
import { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import { getSpecTypes } from '@polkadot/types-known';

import { moonriverV2302 } from './metadata/moonriverV2302';
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

	registry.register(getSpecTypes(registry, 'Moonriver', 'moonriver', specVersion));

	registry.setMetadata(new Metadata(registry, moonriverV2302));

	return registry;
}
const accountNextIndex = () => mockParachainApi.registry.createType('u32', 10);
const asset = (assetId: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();

		const xcUsdtAssetInfo = {
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
			status: mockParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcUsdt = mockParachainApi.registry.createType('PalletAssetsAssetDetails', xcUsdtAssetInfo);
		assets.set('311091173110107856861649819128533077277', xcUsdt);

		const xcKsmAssetInfo = {
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
			status: mockParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcKsm = mockParachainApi.registry.createType('PalletAssetsAssetDetails', xcKsmAssetInfo);
		assets.set('42259045809535163221576417993425387648', xcKsm);

		const xcRmrkAssetInfo = {
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
			status: mockParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcRmrk = mockParachainApi.registry.createType('PalletAssetsAssetDetails', xcRmrkAssetInfo);
		assets.set('182365888117048807484804376330534607370', xcRmrk);

		const maybeAsset = assets.has(assetId) ? assets.get(assetId) : undefined;

		if (maybeAsset) {
			return new Option(createMoonriverRegistry(2302), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockParachainApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const metadata = (assetId: number): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();

		const rawXcKsmMetadata = {
			deposit: mockParachainApi.registry.createType('u128', 0),
			name: mockParachainApi.registry.createType('Bytes', '0x78634b534d'),
			symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x78634b534d'), {
				toHuman: () => 'xcKSM',
			}),
			decimals: mockParachainApi.registry.createType('u8', 12),
			isFrozen: mockParachainApi.registry.createType('bool', false),
		};
		const xcKsmMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcKsmMetadata);
		metadata.set('42259045809535163221576417993425387648', xcKsmMetadata);

		const rawXcUsdtMetadata = {
			deposit: mockParachainApi.registry.createType('u128', 0),
			name: mockParachainApi.registry.createType('Bytes', '0x54657468657220555344'),
			symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x786355534454'), {
				toHuman: () => 'xcUSDT',
			}),
			decimals: mockParachainApi.registry.createType('u8', 6),
			isFrozen: mockParachainApi.registry.createType('bool', false),
		};
		const xcUsdtMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcUsdtMetadata);
		metadata.set('311091173110107856861649819128533077277', xcUsdtMetadata);

		const rawXcRmrkMetadata = {
			deposit: mockParachainApi.registry.createType('u128', 0),
			name: mockParachainApi.registry.createType('Bytes', '0x7863524d524b'),
			symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x7863524d524b'), {
				toHuman: () => 'xcUSDT',
			}),
			decimals: mockParachainApi.registry.createType('u8', 6),
			isFrozen: mockParachainApi.registry.createType('bool', false),
		};
		const xcRmrkMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcRmrkMetadata);
		metadata.set('182365888117048807484804376330534607370', xcRmrkMetadata);

		const maybeMetadata = metadata.has(assetId.toString()) ? metadata.get(assetId.toString()) : undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockParachainApi.registry.createType('PalletAssetsAssetMetadata', {});
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
			asset: Object.assign(asset, {
				entries: () => {
					const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();

					const rawXcKsmMetadata = {
						deposit: mockParachainApi.registry.createType('u128', 0),
						name: mockParachainApi.registry.createType('Bytes', '0x78634b534d'),
						symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x78634b534d'), {
							toHuman: () => 'xcKSM',
						}),
						decimals: mockParachainApi.registry.createType('u8', 12),
						isFrozen: mockParachainApi.registry.createType('bool', false),
					};
					const xcKsmMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcKsmMetadata);
					metadata.set('42259045809535163221576417993425387648', xcKsmMetadata);

					const rawXcUsdtMetadata = {
						deposit: mockParachainApi.registry.createType('u128', 0),
						name: mockParachainApi.registry.createType('Bytes', '0x54657468657220555344'),
						symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x786355534454'), {
							toHuman: () => 'xcUSDT',
						}),
						decimals: mockParachainApi.registry.createType('u8', 6),
						isFrozen: mockParachainApi.registry.createType('bool', false),
					};
					const xcUsdtMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcUsdtMetadata);
					metadata.set('311091173110107856861649819128533077277', xcUsdtMetadata);

					const rawXcRmrkMetadata = {
						deposit: mockParachainApi.registry.createType('u128', 0),
						name: mockParachainApi.registry.createType('Bytes', '0x7863524d524b'),
						symbol: Object.assign(mockParachainApi.registry.createType('Bytes', '0x7863524d524b'), {
							toHuman: () => 'xcUSDT',
						}),
						decimals: mockParachainApi.registry.createType('u8', 6),
						isFrozen: mockParachainApi.registry.createType('bool', false),
					};
					const xcRmrkMetadata = mockParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcRmrkMetadata);
					metadata.set('182365888117048807484804376330534607370', xcRmrkMetadata);

					const result: [StorageKey<[u128]>, PalletAssetsAssetMetadata][] = [];
					metadata.forEach((val, key) => {
						const assetIdU32 = mockParachainApi.registry.createType('u128', key);
						const storageKey = { args: [assetIdU32] } as StorageKey<[u128]>;

						result.push([storageKey, val]);
					});

					return result;
				},
			}),
			metadata: metadata,
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets: mockParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets: mockParachainApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockParachainApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets: mockParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
		xTokens: {
			transferMultiasset: mockParachainApi.tx['xTokens'].transferMultiasset,
			transferMultiassetWithFee: mockParachainApi.tx['xTokens'].transferMultiassetWithFee,
			transferMultiassets: mockParachainApi.tx['xTokens'].transferMultiassets,
		},
	},
	runtimeVersion: {
		transactionVersion: mockParachainApi.registry.createType('u32', 4),
		specVersion: mockParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
