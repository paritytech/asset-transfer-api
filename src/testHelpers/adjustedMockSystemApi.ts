// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import { Metadata, Option, TypeRegistry } from '@polkadot/types';
import type { Header } from '@polkadot/types/interfaces';
import type {
	PalletAssetConversionNativeOrAssetId,
	PalletAssetConversionPoolInfo,
	PalletAssetsAssetDetails,
	PalletAssetsAssetMetadata,
} from '@polkadot/types/lookup';
import { ITuple } from '@polkadot/types-codec/types';
import { getSpecTypes } from '@polkadot/types-known';
import BN from 'bn.js';

import type { UnionXcmMultiLocation } from '../createXcmTypes/types';
import { assetHubWestendV1004000 } from './metadata/assetHubWestendV1004000';
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

	registry.register(getSpecTypes(registry, 'Statemine', 'statemine', specVersion));

	registry.setMetadata(new Metadata(registry, assetHubWestendV1004000));

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
	Promise.resolve().then(() => mockSystemApi.createType('RuntimeDispatchInfoV2', mockWeightInfo));

const getMetadata = () =>
	Promise.resolve().then(() => mockSystemApi.registry.createType('Metadata', assetHubWestendV1004000));

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

const asset = (assetId: number | string | BN): Promise<Option<PalletAssetsAssetDetails>> =>
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
			status: mockSystemApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const insufficientAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', insufficientAssetInfo);
		assets.set(100, insufficientAsset);

		const sufficientAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', multiLocationAssetInfo);
		assets.set(1984, sufficientAsset);

		const adjAsset = BN.isBN(assetId)
			? assetId.toNumber()
			: typeof assetId === 'string'
			? Number.parseInt(assetId)
			: assetId;
		const maybeAsset = assets.has(adjAsset) ? assets.get(adjAsset) : undefined;

		if (maybeAsset) {
			return new Option(createStatemineRegistry(9435), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const assetsMetadata = (assetId: number | string | BN): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<number, PalletAssetsAssetMetadata> = new Map();

		const rawUSDtMetadata = {
			deposit: mockSystemApi.registry.createType('u128', 0),
			name: mockSystemApi.registry.createType('Bytes', '0x78634b534d'),
			symbol: Object.assign(mockSystemApi.registry.createType('Bytes', '0x78634b534d'), {
				toHuman: () => 'USDt',
			}),
			decimals: mockSystemApi.registry.createType('u8', 12),
			isFrozen: mockSystemApi.registry.createType('bool', false),
		};
		const usdtMetadata = mockSystemApi.registry.createType('PalletAssetsAssetMetadata', rawUSDtMetadata);
		metadata.set(1984, usdtMetadata);

		const adjAsset = BN.isBN(assetId)
			? assetId.toNumber()
			: typeof assetId === 'string'
			? Number.parseInt(assetId)
			: assetId;
		const maybeMetadata = metadata.has(adjAsset) ? metadata.get(adjAsset) : undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockSystemApi.registry.createType('PalletAssetsAssetMetadata', {});
	});

const foreignAsset = (asset: UnionXcmMultiLocation): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const assetsMutliLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', asset);
		const multiLocationStr = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
		const multiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', JSON.parse(multiLocationStr));
		const multiLocationAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', multiLocationAssetInfo);
		assets.set(multiLocation.toHex(), multiLocationAsset);

		const maybeAsset = assets.has(assetsMutliLocation.toHex()) ? assets.get(assetsMutliLocation.toHex()) : undefined;

		if (maybeAsset) {
			return new Option(createStatemineRegistry(9435), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const foreignAssetsMetadata = (assetId: UnionXcmMultiLocation): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();
		const assetIdMultiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', assetId);

		const rawTnkrMultiLocationMetadata = {
			deposit: mockSystemApi.registry.createType('u128', 6693666633),
			name: mockSystemApi.registry.createType('Bytes', '0x54696e6b65726e6574'),
			symbol: Object.assign(mockSystemApi.registry.createType('Bytes', '0x544e4b52'), {
				toHuman: () => 'TNKR',
			}),
			decimals: mockSystemApi.registry.createType('u8', 12),
			isFrozen: mockSystemApi.registry.createType('bool', false),
		};
		const tnkrForeignAssetMetadata = mockSystemApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawTnkrMultiLocationMetadata
		);
		const multiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', {
			parents: '1',
			interior: { X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }] },
		});
		metadata.set(multiLocation.toHex(), tnkrForeignAssetMetadata);

		const maybeMetadata = metadata.has(assetIdMultiLocation.toHex())
			? metadata.get(assetIdMultiLocation.toHex())
			: undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockSystemApi.registry.createType('PalletAssetsAssetMetadata', {});
	});

const poolAsset = (asset: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', multiLocationAssetInfo);

		assets.set('0', multiLocationAsset);

		const maybeAsset = assets.has(asset) ? assets.get(asset) : undefined;

		if (maybeAsset) {
			return new Option(createStatemineRegistry(9435), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const pools = (
	_arg: ITuple<[PalletAssetConversionNativeOrAssetId, PalletAssetConversionNativeOrAssetId]>
): Promise<[PalletAssetConversionNativeOrAssetId, PalletAssetConversionPoolInfo]> =>
	Promise.resolve().then(() => {
		const palletAssetConversionNativeOrAssetId = mockSystemApi.registry.createType(
			'PalletAssetConversionNativeOrAssetId',
			[
				{ parents: 0, interior: { Here: '' } },
				{
					parents: 0,
					interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
				},
			]
		);

		const poolInfo = mockSystemApi.registry.createType('PalletAssetConversionPoolInfo', {
			lpToken: 0,
		});

		return [palletAssetConversionNativeOrAssetId, poolInfo];
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
	registry: createStatemineRegistry(1004000),
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
			metadata: assetsMetadata,
		},
		foreignAssets: {
			asset: foreignAsset,
			metadata: foreignAssetsMetadata,
		},
		poolAssets: {
			asset: poolAsset,
		},
		assetConversion: {
			pools: Object.assign(pools, {
				entries: () => {
					const palletAssetConversionNativeOrAssetId = Object.assign(
						[
							{ parents: 0, interior: { Here: '' } },
							{
								parents: 0,
								interior: {
									X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }],
								},
							},
						],
						{
							toHuman: () => {
								return [
									[
										{ parents: '0', interior: { Here: '' } },
										{
											parents: '0',
											interior: {
												X2: [{ PalletInstance: '50' }, { GeneralIndex: '100' }],
											},
										},
									],
								];
							},
						}
					);

					const poolInfo = Object.assign(
						{
							lpToken: mockSystemApi.registry.createType('u32', 0),
						},
						{
							unwrap: () => {
								return {
									lpToken: mockSystemApi.registry.createType('u32', 0),
								};
							},
						}
					);

					return [[palletAssetConversionNativeOrAssetId, poolInfo]];
				},
			}),
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets: mockSystemApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets: mockSystemApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockSystemApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets: mockSystemApi.tx['polkadotXcm'].limitedTeleportAssets,
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
		poolAssets: {
			transfer: mockSystemApi.tx.poolAssets.transfer,
			transferKeepAlive: mockSystemApi.tx.poolAssets.transferKeepAlive,
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
