// Copyright 2023 Parity Technologies (UK) Ltd.

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
		}),
	);

	registry.register(getSpecTypes(registry, 'Statemine', 'statemine', specVersion));

	registry.setMetadata(new Metadata(registry, assetHubWestendV1004000));

	return registry;
}
const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockSystemApi.registry.createType('Text', 'asset-hub-westend'),
			specVersion: mockSystemApi.registry.createType('u32', 1004000),
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
		}),
	);

const createType = mockSystemApi.registry.createType.bind(mockSystemApi);
const accountNextIndex = () => mockSystemApi.registry.createType('u32', 10);

const multiLocationAssetInfo = {
	owner: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	issuer: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	admin: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	freezer: mockSystemApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
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
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockSystemApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
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
			return new Option(createStatemineRegistry(1004000), 'PalletAssetsAssetDetails', maybeAsset);
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
		const multiLocationStr = '{"parents":"1","interior":{"X2": [{"Parachain":"1103"}, {"GeneralIndex": "0"}]}}';
		const multiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', JSON.parse(multiLocationStr));
		const multiLocationAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', multiLocationAssetInfo);
		assets.set(multiLocation.toHex(), multiLocationAsset);

		const maybeAsset = assets.has(assetsMutliLocation.toHex()) ? assets.get(assetsMutliLocation.toHex()) : undefined;

		if (maybeAsset) {
			return new Option(createStatemineRegistry(1004000), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const foreignAssetsMetadata = (assetId: UnionXcmMultiLocation): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();
		const assetIdMultiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', assetId);

		const rawTnkrMultiLocationMetadata = {
			deposit: mockSystemApi.registry.createType('u128', 6693666633),
			name: mockSystemApi.registry.createType('Bytes', '0x476f647a696c6c61'),
			symbol: Object.assign(mockSystemApi.registry.createType('Bytes', '0x47445a'), {
				toHuman: () => 'GDZ',
			}),
			decimals: mockSystemApi.registry.createType('u8', 12),
			isFrozen: mockSystemApi.registry.createType('bool', false),
		};
		const tnkrForeignAssetMetadata = mockSystemApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawTnkrMultiLocationMetadata,
		);
		const multiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', {
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

		return mockSystemApi.registry.createType('PalletAssetsAssetMetadata', {});
	});

const poolAsset = (asset: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationAsset = mockSystemApi.registry.createType('PalletAssetsAssetDetails', multiLocationAssetInfo);

		assets.set('0', multiLocationAsset);

		const maybeAsset = assets.has(asset) ? assets.get(asset) : undefined;

		if (maybeAsset) {
			return new Option(createStatemineRegistry(1004000), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockSystemApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const pools = (
	_arg: ITuple<[PalletAssetConversionEvent, PalletAssetConversionEvent]>,
): Promise<[PalletAssetConversionEvent, PalletAssetConversionPoolInfo][]> =>
	Promise.resolve().then(() => {
		const palletAssetConversionNativeOrAssetId1 = mockSystemApi.registry.createType('PalletAssetConversionEvent', [
			{ parents: 0, interior: { Here: '' } },
			{
				parents: 0,
				interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
			},
		]);

		const poolInfo1 = mockSystemApi.registry.createType('PalletAssetConversionPoolInfo', {
			lpToken: 0,
		});

		const palletAssetConversionNativeOrAssetId2 = mockSystemApi.registry.createType('PalletAssetConversionEvent', [
			{ parents: 0, interior: { Here: '' } },
			{
				parents: 0,
				interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
			},
		]);

		const poolInfo2 = mockSystemApi.registry.createType('PalletAssetConversionPoolInfo', {
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
			asset: Object.assign(foreignAsset, {
				entries: () => {
					const storageKeyData = [
						[
							Object.assign(
								'0x30e64a56026f4b5e3c2d196283a9a17dd34371a193a751eea5883e9553457b2e1afcbaa957381128fa2f32d7b2871124020209079edaa8020300c9f05326311bc2a55426761bec20057685fb80f7',
								{
									toHuman: () => {
										return [{ parents: '1', interior: { X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }] } }];
									},
								},
							),
							{
								owner: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								issuer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								admin: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								freezer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								supply: '0x00000000000000001bc16d674ec80000',
								deposit: 100000000000,
								minBalance: 1,
								isSufficient: false,
								accounts: 1,
								sufficients: 0,
								approvals: 0,
								status: 'Live',
							},
						],
						[
							Object.assign(
								'0x30e64a56026f4b5e3c2d196283a9a17dd34371a193a751eea5883e9553457b2e40829062ff2f47b747a4ffd8da5b653f020209079edaa8020300b34a6924a02100ba6ef12af1c798285e8f7a16ee',
								{
									toHuman: () => {
										return [{ parents: '2', interior: { X1: { GlobalConsensus: 'Paseo' } } }];
									},
								},
							),
							{
								owner: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								issuer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								admin: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								freezer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								supply: '0x00000000000000001bc16d674ec80000',
								deposit: 100000000000,
								minBalance: 1,
								isSufficient: false,
								accounts: 1,
								sufficients: 0,
								approvals: 0,
								status: 'Live',
							},
						],
						[
							Object.assign(
								'0x30e64a56026f4b5e3c2d196283a9a17dd34371a193a751eea5883e9553457b2e8e98a2f8b983529ae6515f403f4b5bd5020209079edaa8020300c3d088842dcf02c13699f936bb83dfbbc6f721ab',
								{
									toHuman: () => {
										return [{ parents: '2', interior: { X1: { GlobalConsensus: 'Polkadot' } } }];
									},
								},
							),
							{
								owner: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								issuer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								admin: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								freezer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								supply: '0x00000000000000001bc16d674ec80000',
								deposit: 100000000000,
								minBalance: 1,
								isSufficient: false,
								accounts: 1,
								sufficients: 0,
								approvals: 0,
								status: 'Live',
							},
						],
						[
							Object.assign(
								'0x30e64a56026f4b5e3c2d196283a9a17dd34371a193a751eea5883e9553457b2eb3a5911d7874cd9283dcfd1fe247aa0d010100b11c',
								{
									toHuman: () => {
										return [
											{
												parents: '2',
												interior: {
													X2: [
														{ GlobalConsensus: { Ethereum: { chainId: '11155111' } } },
														{ AccountKey20: { network: null, key: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14' } },
													],
												},
											},
										];
									},
								},
							),
							{
								owner: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								issuer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								admin: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								freezer: '5GjRnmh5o3usSYzVmsxBWzHEpvJyHK4tKNPhjpUR3ASrruBy',
								supply: '0x00000000000000001bc16d674ec80000',
								deposit: 100000000000,
								minBalance: 1,
								isSufficient: false,
								accounts: 1,
								sufficients: 0,
								approvals: 0,
								status: 'Live',
							},
						],
					];

					return storageKeyData;
				},
			}),
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
										lpToken: mockSystemApi.registry.createType('u32', 0),
									},
									{
										unwrap: () => {
											return {
												lpToken: mockSystemApi.registry.createType('u32', 0),
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
										lpToken: mockSystemApi.registry.createType('u32', 1),
									},
									{
										unwrap: () => {
											return {
												lpToken: mockSystemApi.registry.createType('u32', 1),
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
			transferAllowDeath: mockSystemApi.tx.balances.transferAllowDeath,
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
		specVersion: mockSystemApi.registry.createType('u32', 1004000),
	},
	genesisHash: mockSystemApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
