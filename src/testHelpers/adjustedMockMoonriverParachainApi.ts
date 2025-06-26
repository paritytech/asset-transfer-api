import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { Metadata, Option, StorageKey, TypeRegistry, u128 } from '@polkadot/types';
import type { Call, Extrinsic, Header } from '@polkadot/types/interfaces';
import { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { ISubmittableResult } from '@polkadot/types/types';
import { getSpecTypes } from '@polkadot/types-known';

import { moonriverV2302 } from './metadata/moonriverV2302';
import { mockMoonriverParachainApi } from './mockMoonriverParachainApi';

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockMoonriverParachainApi.registry.createType('Option<u32>', 2);
	});

const getParachainRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockMoonriverParachainApi.registry.createType('Text', 'moonriver'),
			specVersion: mockMoonriverParachainApi.registry.createType('u32', 2302),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockMoonriverParachainApi.registry.createType('Header', {
			number: mockMoonriverParachainApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockMoonriverParachainApi.registry.createType('Hash'),
			stateRoot: mockMoonriverParachainApi.registry.createType('Hash'),
			extrinsicsRoot: mockMoonriverParachainApi.registry.createType('Hash'),
			digest: mockMoonriverParachainApi.registry.createType('Digest'),
		}),
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
		}),
	);

	registry.register(getSpecTypes(registry, 'Moonriver', 'moonriver', specVersion));

	registry.setMetadata(new Metadata(registry, moonriverV2302));

	return registry;
}
const accountNextIndex = () => mockMoonriverParachainApi.registry.createType('u32', 10);
const asset = (assetId: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();

		const xcUsdtAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcUsdt = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcUsdtAssetInfo);
		assets.set('311091173110107856861649819128533077277', xcUsdt);

		const xcKsmAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcKsm = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcKsmAssetInfo);
		assets.set('42259045809535163221576417993425387648', xcKsm);

		const xcBncAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcBnc = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcBncAssetInfo);
		assets.set('319623561105283008236062145480775032445', xcBnc);

		const xcvBncAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcvBnc = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcvBncAssetInfo);
		assets.set('72145018963825376852137222787619937732', xcvBnc);

		const xcvMovrAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcvMovr = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcvMovrAssetInfo);
		assets.set('203223821023327994093278529517083736593', xcvMovr);

		// SDN
		const xcSDNAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcSdn = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcSDNAssetInfo);
		assets.set('16797826370226091782818345603793389938', xcSdn);

		const xcRmrkAssetInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};

		const xcRmrk = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcRmrkAssetInfo);
		assets.set('182365888117048807484804376330534607370', xcRmrk);

		// Test asset that should not exist inside of xcAssets, so we can test when its on chain and when its not available in the registry
		const xcTestInfo = {
			owner: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockMoonriverParachainApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockMoonriverParachainApi.registry.createType('u128', 100),
			deposit: mockMoonriverParachainApi.registry.createType('u128', 100),
			minBalance: mockMoonriverParachainApi.registry.createType('u128', 100),
			isSufficient: mockMoonriverParachainApi.registry.createType('bool', true),
			accounts: mockMoonriverParachainApi.registry.createType('u32', 100),
			sufficients: mockMoonriverParachainApi.registry.createType('u32', 100),
			approvals: mockMoonriverParachainApi.registry.createType('u32', 100),
			status: mockMoonriverParachainApi.registry.createType('PalletAssetsAssetStatus', 'live'),
		};
		const xcTest = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetDetails', xcTestInfo);
		assets.set('999999999999999999999999999999999999999', xcTest);

		const maybeAsset = assets.has(assetId) ? assets.get(assetId) : undefined;

		if (maybeAsset) {
			return new Option(createMoonriverRegistry(2302), 'PalletAssetsAssetDetails', maybeAsset);
		}

		return mockMoonriverParachainApi.registry.createType('Option<PalletAssetsAssetDetails>', undefined);
	});

const metadata = (assetId: number): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();

		const rawXcKsmMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x78634b534d'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x78634b534d'), {
				toHuman: () => 'xcKSM',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcKsmMetadata = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXcKsmMetadata);
		metadata.set('42259045809535163221576417993425387648', xcKsmMetadata);

		// xcBNC
		const rawXCBNCMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x7863424e43'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863424e43'), {
				toHuman: () => 'xcBNC',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcBNCMetadata = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXCBNCMetadata);
		metadata.set('319623561105283008236062145480775032445', xcBNCMetadata);

		// xcvBNC
		const rawXCVBNCMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x426966726f737420566f756368657220424e43'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786376424e43'), {
				toHuman: () => 'xcvBNC',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcvBNCMetadata = mockMoonriverParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXCVBNCMetadata,
		);
		metadata.set('72145018963825376852137222787619937732', xcvBNCMetadata);

		// vMOVR
		const rawXCVMOVRMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x426966726f737420566f7563686572204d4f5652'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863764d4f5652'), {
				toHuman: () => 'xcvBNC',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 18),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcvMOVRMetadata = mockMoonriverParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXCVMOVRMetadata,
		);
		metadata.set('203223821023327994093278529517083736593', xcvMOVRMetadata);

		// SDN
		const rawXCSDNMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x53686964656e'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786353444e'), {
				toHuman: () => 'xcvBNC',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 18),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcSDNMetadata = mockMoonriverParachainApi.registry.createType('PalletAssetsAssetMetadata', rawXCSDNMetadata);
		metadata.set('203223821023327994093278529517083736593', xcSDNMetadata);

		const rawXcUsdtMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x54657468657220555344'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786355534454'), {
				toHuman: () => 'xcUSDT',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 6),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcUsdtMetadata = mockMoonriverParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXcUsdtMetadata,
		);
		metadata.set('311091173110107856861649819128533077277', xcUsdtMetadata);

		const rawXcRmrkMetadata = {
			deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
			name: mockMoonriverParachainApi.registry.createType('Bytes', '0x7863524d524b'),
			symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863524d524b'), {
				toHuman: () => 'xcRMRK',
			}),
			decimals: mockMoonriverParachainApi.registry.createType('u8', 6),
			isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
		};
		const xcRmrkMetadata = mockMoonriverParachainApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawXcRmrkMetadata,
		);
		metadata.set('182365888117048807484804376330534607370', xcRmrkMetadata);

		const maybeMetadata = metadata.has(assetId.toString()) ? metadata.get(assetId.toString()) : undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockMoonriverParachainApi.registry.createType('PalletAssetsAssetMetadata', {});
	});
const mockSubmittableExt = mockMoonriverParachainApi.registry.createType(
	'Extrinsic',
	'0x0501046a010100010200451f0608010a0013000064a7b3b6e00d01010200451f0100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300',
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

export const adjustedMockMoonriverParachainApi = {
	registry: mockMoonriverParachainApi.registry,
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

					// xcKSM
					const rawXcKsmMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x78634b534d'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x78634b534d'), {
							toHuman: () => 'xcKSM',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcKsmMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXcKsmMetadata,
					);
					metadata.set('42259045809535163221576417993425387648', xcKsmMetadata);

					// xcBNC
					const rawXCBNCMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x7863424e43'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863424e43'), {
							toHuman: () => 'xcBNC',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcBNCMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXCBNCMetadata,
					);
					metadata.set('319623561105283008236062145480775032445', xcBNCMetadata);

					// xcvBNC
					const rawXCVBNCMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x426966726f737420566f756368657220424e43'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786376424e43'), {
							toHuman: () => 'xcvBNC',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 12),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcvBNCMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXCVBNCMetadata,
					);
					metadata.set('72145018963825376852137222787619937732', xcvBNCMetadata);

					// vMOVR
					const rawXCVMOVRMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x426966726f737420566f7563686572204d4f5652'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863764d4f5652'), {
							toHuman: () => 'xcvBNC',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 18),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcvMOVRMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXCVMOVRMetadata,
					);
					metadata.set('203223821023327994093278529517083736593', xcvMOVRMetadata);

					// SDN
					const rawXCSDNMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x53686964656e'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786353444e'), {
							toHuman: () => 'xcvBNC',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 18),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcSDNMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXCSDNMetadata,
					);
					metadata.set('203223821023327994093278529517083736593', xcSDNMetadata);

					// USDT
					const rawXcUsdtMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x54657468657220555344'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x786355534454'), {
							toHuman: () => 'xcUSDT',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 6),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcUsdtMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXcUsdtMetadata,
					);
					metadata.set('311091173110107856861649819128533077277', xcUsdtMetadata);

					const rawXcRmrkMetadata = {
						deposit: mockMoonriverParachainApi.registry.createType('u128', 0),
						name: mockMoonriverParachainApi.registry.createType('Bytes', '0x7863524d524b'),
						symbol: Object.assign(mockMoonriverParachainApi.registry.createType('Bytes', '0x7863524d524b'), {
							toHuman: () => 'xcUSDT',
						}),
						decimals: mockMoonriverParachainApi.registry.createType('u8', 6),
						isFrozen: mockMoonriverParachainApi.registry.createType('bool', false),
					};
					const xcRmrkMetadata = mockMoonriverParachainApi.registry.createType(
						'PalletAssetsAssetMetadata',
						rawXcRmrkMetadata,
					);
					metadata.set('182365888117048807484804376330534607370', xcRmrkMetadata);

					const result: [StorageKey<[u128]>, PalletAssetsAssetMetadata][] = [];
					metadata.forEach((val, key) => {
						const assetIdU32 = mockMoonriverParachainApi.registry.createType('u128', key);
						const storageKey = { args: [assetIdU32] } as StorageKey<[u128]>;

						result.push([storageKey, val]);
					});

					return result;
				},
			}),
			metadata: metadata,
		},
	},
	tx: Object.assign(
		(_extrinsic: Call | Extrinsic | Uint8Array | string) => {
			return mockSubmittableExt;
		},
		{
			polkadotXcm: {
				limitedReserveTransferAssets: mockMoonriverParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
				reserveTransferAssets: mockMoonriverParachainApi.tx['polkadotXcm'].reserveTransferAssets,
				teleportAssets: mockMoonriverParachainApi.tx['polkadotXcm'].teleportAssets,
				limitedTeleportAssets: mockMoonriverParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
			},
			xTokens: {
				transferMultiasset: mockMoonriverParachainApi.tx['xTokens'].transferMultiasset,
				transferMultiassetWithFee: mockMoonriverParachainApi.tx['xTokens'].transferMultiassetWithFee,
				transferMultiassets: mockMoonriverParachainApi.tx['xTokens'].transferMultiassets,
			},
		},
	),
	runtimeVersion: {
		transactionVersion: mockMoonriverParachainApi.registry.createType('u32', 4),
		specVersion: mockMoonriverParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockMoonriverParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
