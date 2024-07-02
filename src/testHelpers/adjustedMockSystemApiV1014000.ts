// Copyright 2023 Parity Technologies (UK) Ltd.
import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import { Metadata, Option, TypeRegistry } from '@polkadot/types';
import type { Header } from '@polkadot/types/interfaces';
import type {
	PalletAssetConversionEvent,
	PalletAssetConversionPoolInfo,
	PalletAssetsAssetDetails,
	PalletAssetsAssetMetadata,
} from '@polkadot/types/lookup';
import { ITuple } from '@polkadot/types-codec/types';
import { getSpecTypes } from '@polkadot/types-known';
import BN from 'bn.js';

import type { UnionXcmMultiLocation } from '../createXcmTypes/types';
import { assetHubWestendV1014000 } from './metadata/assetHubWestendV1014000';
import { mockSystemApiV1014000 } from './mockSystemApiV1014000';
import { mockWeightInfo } from './mockWeightInfo';
/**
 * Create a type registry for Westmint.
 * Useful for creating types in order to facilitate testing.
 *
 * @param specVersion Westmint runtime spec version to get type defs for.
 */
function createWestmintRegistry(specVersion: number): TypeRegistry {
	const registry = new TypeRegistry();

	registry.setChainProperties(
		registry.createType('ChainProperties', {
			ss58Format: 42,
			tokenDecimals: 12,
			tokenSymbol: 'WND',
		}),
	);

	registry.register(getSpecTypes(registry, 'Westmint', 'westmint', specVersion));

	registry.setMetadata(new Metadata(registry, assetHubWestendV1014000));

	return registry;
}
const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockSystemApiV1014000.registry.createType('Text', 'asset-hub-westend'),
			specVersion: mockSystemApiV1014000.registry.createType('u32', 1014000),
		};
	});

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockSystemApiV1014000.registry.createType('Option<u32>', 2);
	});

const queryInfoCallAt = () =>
	Promise.resolve().then(() => mockSystemApiV1014000.createType('RuntimeDispatchInfoV2', mockWeightInfo));

const getMetadata = () =>
	Promise.resolve().then(() => mockSystemApiV1014000.registry.createType('Metadata', assetHubWestendV1014000));

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockSystemApiV1014000.registry.createType('Header', {
			number: mockSystemApiV1014000.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockSystemApiV1014000.registry.createType('Hash'),
			stateRoot: mockSystemApiV1014000.registry.createType('Hash'),
			extrinsicsRoot: mockSystemApiV1014000.registry.createType('Hash'),
			digest: mockSystemApiV1014000.registry.createType('Digest'),
		}),
	);

const createType = mockSystemApiV1014000.registry.createType.bind(mockSystemApiV1014000);
const accountNextIndex = () => mockSystemApiV1014000.registry.createType('u32', 10);

const multiLocationAssetInfo = {
	owner: mockSystemApiV1014000.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	issuer: mockSystemApiV1014000.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	admin: mockSystemApiV1014000.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	freezer: mockSystemApiV1014000.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	supply: mockSystemApiV1014000.registry.createType('u128', 100),
	deposit: mockSystemApiV1014000.registry.createType('u128', 100),
	minBalance: mockSystemApiV1014000.registry.createType('u128', 100),
	isSufficient: mockSystemApiV1014000.registry.createType('bool', true),
	accounts: mockSystemApiV1014000.registry.createType('u32', 100),
	sufficients: mockSystemApiV1014000.registry.createType('u32', 100),
	approvals: mockSystemApiV1014000.registry.createType('u32', 100),
	status: mockSystemApiV1014000.registry.createType('PalletAssetsAssetStatus', 'live'),
};

const asset = (assetId: number | string | BN): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<number, PalletAssetsAssetDetails> = new Map();

		const insufficientAssetInfo = {
			owner: mockSystemApiV1014000.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockSystemApiV1014000.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockSystemApiV1014000.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockSystemApiV1014000.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockSystemApiV1014000.registry.createType('u128', 100),
			deposit: mockSystemApiV1014000.registry.createType('u128', 100),
			minBalance: mockSystemApiV1014000.registry.createType('u128', 100),
			isSufficient: mockSystemApiV1014000.registry.createType('bool', false),
			accounts: mockSystemApiV1014000.registry.createType('u32', 100),
			sufficients: mockSystemApiV1014000.registry.createType('u32', 100),
			approvals: mockSystemApiV1014000.registry.createType('u32', 100),
			status: mockSystemApiV1014000.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const insufficientAsset = mockSystemApiV1014000.registry.createType(
			'PalletAssetsAssetDetails',
			insufficientAssetInfo,
		);
		assets.set(100, insufficientAsset);

		const sufficientAsset = mockSystemApiV1014000.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);
		assets.set(1984, sufficientAsset);

		const adjAsset = BN.isBN(assetId)
			? assetId.toNumber()
			: typeof assetId === 'string'
			  ? Number.parseInt(assetId)
			  : assetId;
		const maybeAsset = assets.has(adjAsset) ? assets.get(adjAsset) : undefined;

		if (maybeAsset) {
			return new Option(createWestmintRegistry(1014000), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApiV1014000.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const assetsMetadata = (assetId: number | string | BN): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<number, PalletAssetsAssetMetadata> = new Map();

		const rawUSDtMetadata = {
			deposit: mockSystemApiV1014000.registry.createType('u128', 0),
			name: mockSystemApiV1014000.registry.createType('Bytes', '0x78634b534d'),
			symbol: Object.assign(mockSystemApiV1014000.registry.createType('Bytes', '0x78634b534d'), {
				toHuman: () => 'USDt',
			}),
			decimals: mockSystemApiV1014000.registry.createType('u8', 12),
			isFrozen: mockSystemApiV1014000.registry.createType('bool', false),
		};
		const usdtMetadata = mockSystemApiV1014000.registry.createType('PalletAssetsAssetMetadata', rawUSDtMetadata);
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

		return mockSystemApiV1014000.registry.createType('PalletAssetsAssetMetadata', {});
	});

const foreignAsset = (asset: UnionXcmMultiLocation): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const assetsMutliLocation = mockSystemApiV1014000.registry.createType('XcmV2MultiLocation', asset);
		const multiLocationStr = '{"parents":"1","interior":{"X2": [{"Parachain":"1103"}, {"GeneralIndex": "0"}]}}';
		const multiLocation = mockSystemApiV1014000.registry.createType('XcmV2MultiLocation', JSON.parse(multiLocationStr));
		const multiLocationAsset = mockSystemApiV1014000.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);
		assets.set(multiLocation.toHex(), multiLocationAsset);

		const maybeAsset = assets.has(assetsMutliLocation.toHex()) ? assets.get(assetsMutliLocation.toHex()) : undefined;

		if (maybeAsset) {
			return new Option(createWestmintRegistry(1014000), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApiV1014000.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const foreignAssetsMetadata = (assetId: UnionXcmMultiLocation): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();
		const assetIdMultiLocation = mockSystemApiV1014000.registry.createType('XcmV2MultiLocation', assetId);

		const rawTnkrMultiLocationMetadata = {
			deposit: mockSystemApiV1014000.registry.createType('u128', 6693666633),
			name: mockSystemApiV1014000.registry.createType('Bytes', '0x476f647a696c6c61'),
			symbol: Object.assign(mockSystemApiV1014000.registry.createType('Bytes', '0x47445a'), {
				toHuman: () => 'GDZ',
			}),
			decimals: mockSystemApiV1014000.registry.createType('u8', 12),
			isFrozen: mockSystemApiV1014000.registry.createType('bool', false),
		};
		const tnkrForeignAssetMetadata = mockSystemApiV1014000.registry.createType(
			'PalletAssetsAssetMetadata',
			rawTnkrMultiLocationMetadata,
		);
		const multiLocation = mockSystemApiV1014000.registry.createType('XcmV2MultiLocation', {
			parents: '1',
			interior: { X2: [{ Parachain: '1103' }, { GeneralIndex: '0' }] },
		});
		metadata.set(multiLocation.toHex(), tnkrForeignAssetMetadata);

		const maybeMetadata = metadata.has(assetIdMultiLocation.toHex())
			? metadata.get(assetIdMultiLocation.toHex())
			: undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockSystemApiV1014000.registry.createType('PalletAssetsAssetMetadata', {});
	});

const poolAsset = (asset: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationAsset = mockSystemApiV1014000.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);

		assets.set('0', multiLocationAsset);

		const maybeAsset = assets.has(asset) ? assets.get(asset) : undefined;

		if (maybeAsset) {
			return new Option(createWestmintRegistry(1014000), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApiV1014000.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const pools = (
	_arg: ITuple<[PalletAssetConversionEvent, PalletAssetConversionEvent]>,
): Promise<[PalletAssetConversionEvent, PalletAssetConversionPoolInfo][]> =>
	Promise.resolve().then(() => {
		const palletAssetConversionNativeOrAssetId1 = mockSystemApiV1014000.registry.createType(
			'PalletAssetConversionEvent',
			[
				{ parents: 0, interior: { Here: '' } },
				{
					parents: 0,
					interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
				},
			],
		);

		const poolInfo1 = mockSystemApiV1014000.registry.createType('PalletAssetConversionPoolInfo', {
			lpToken: 0,
		});

		const palletAssetConversionNativeOrAssetId2 = mockSystemApiV1014000.registry.createType(
			'PalletAssetConversionEvent',
			[
				{ parents: 0, interior: { Here: '' } },
				{
					parents: 0,
					interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
				},
			],
		);

		const poolInfo2 = mockSystemApiV1014000.registry.createType('PalletAssetConversionPoolInfo', {
			lpToken: 1,
		});

		return [
			[palletAssetConversionNativeOrAssetId1, poolInfo1],
			[palletAssetConversionNativeOrAssetId2, poolInfo2],
		];
	});

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedMockSystemApiV1014000 = {
	createType: createType,
	registry: createWestmintRegistry(1014000),
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
					const palletAssetConversionData = Object.assign(
						[
							[
								Object.assign(
									[
										{ parents: '0', interior: { Here: '' } },
										{
											parents: '0',
											interior: {
												X2: [{ PalletInstance: '50' }, { GeneralIndex: '100' }],
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
												0,
											];
										},
									},
								),
								Object.assign(
									{
										lpToken: mockSystemApiV1014000.registry.createType('u32', 0),
									},
									{
										unwrap: () => {
											return {
												lpToken: mockSystemApiV1014000.registry.createType('u32', 0),
											};
										},
									},
								),
							],
							[
								Object.assign(
									[
										{ parents: '0', interior: { Here: '' } },
										{
											parents: '0',
											interior: {
												X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
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
															X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
														},
													},
												],
												1,
											];
										},
									},
								),
								Object.assign(
									{
										lpToken: mockSystemApiV1014000.registry.createType('u32', 1),
									},
									{
										unwrap: () => {
											return {
												lpToken: mockSystemApiV1014000.registry.createType('u32', 1),
											};
										},
									},
								),
							],
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
									[
										{ parents: '0', interior: { Here: '' } },
										{
											parents: '0',
											interior: {
												X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
											},
										},
									],
								];
							},
						},
					);

					return palletAssetConversionData;
				},
			}),
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets: mockSystemApiV1014000.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets: mockSystemApiV1014000.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockSystemApiV1014000.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets: mockSystemApiV1014000.tx['polkadotXcm'].limitedTeleportAssets,
			transferAssets: mockSystemApiV1014000.tx['polkadotXcm'].transferAssets,
		},
		assets: {
			transfer: mockSystemApiV1014000.tx.assets.transfer,
			transferKeepAlive: mockSystemApiV1014000.tx.assets.transferKeepAlive,
		},
		foreignAssets: {
			transfer: mockSystemApiV1014000.tx.foreignAssets.transfer,
			transferKeepAlive: mockSystemApiV1014000.tx.foreignAssets.transferKeepAlive,
		},
		balances: {
			transfer: mockSystemApiV1014000.tx.balances.transfer,
			transferAllowDeath: mockSystemApiV1014000.tx.balances.transferAllowDeath,
			transferKeepAlive: mockSystemApiV1014000.tx.balances.transferKeepAlive,
		},
		poolAssets: {
			transfer: mockSystemApiV1014000.tx.poolAssets.transfer,
			transferKeepAlive: mockSystemApiV1014000.tx.poolAssets.transferKeepAlive,
		},
	},
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
	runtimeVersion: {
		transactionVersion: mockSystemApiV1014000.registry.createType('u32', 16),
		specVersion: mockSystemApiV1014000.registry.createType('u32', 1014000),
	},
	genesisHash: mockSystemApiV1014000.registry.createType('BlockHash'),
} as unknown as ApiPromise;
