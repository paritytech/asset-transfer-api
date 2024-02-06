// Copyright 2023 Parity Technologies (UK) Ltd.

import reg from '@substrate/asset-transfer-api-registry';

import { parseRegistry } from './parseRegistry';
import { ChainInfoKeys, ChainInfoRegistry } from './types';

describe('parseRegistry', () => {
	it('Should return the correct object structure', () => {
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, {});

		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
		expect(registry.kusama['0'].tokens).toStrictEqual(['KSM']);
		expect(registry.westend['0'].tokens).toStrictEqual(['WND']);
		expect(registry.rococo['0'].tokens).toStrictEqual(['ROC']);
	});
	it('Should correctly overwrite rococos asset-hub specName', () => {
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, {});
		expect(registry.rococo['1000'].specName).toEqual('asset-hub-rococo');
	});
	it('Should correctly inject an injectedRegsitry', () => {
		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				polkadot: {
					'9876': {
						tokens: ['TST'],
						assetsInfo,
						foreignAssetsInfo,
						specName: 'testing',
						poolPairsInfo: {},
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.polkadot['9876']).toStrictEqual({
			tokens: ['TST'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'testing',
			poolPairsInfo: {},
		});
		// Ensure nothing was overwritten
		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
	});
	it('Should correctly update the registry with an injectedRegsitry without specName', () => {
		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				westend: {
					'0': {
						tokens: ['WND', 'WND2'],
						assetsInfo,
						foreignAssetsInfo,
						poolPairsInfo: {},
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['0']).toStrictEqual({
			tokens: ['WND', 'WND2'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'westend',
			poolPairsInfo: {},
		});
	});
	it('Should correctly update the registry with an injectedRegsitry without tokens while ignoring specName', () => {
		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				westend: {
					'0': {
						assetsInfo,
						foreignAssetsInfo,
						poolPairsInfo: {},
						specName: 'totoro',
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['0']).toStrictEqual({
			tokens: ['WND', 'WND2'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'westend',
			poolPairsInfo: {},
		});
	});
	it("Should correctly update the registry's token entry with an injectedRegsitry", () => {
		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				westend: {
					'0': {
						tokens: ['WOP'],
						assetsInfo,
						foreignAssetsInfo,
						poolPairsInfo: {},
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['0']).toStrictEqual({
			tokens: ['WND', 'WND2', 'WOP'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'westend',
			poolPairsInfo: {},
		});
	});
	it('Should correctly add a previously missing injectedRegsitry without assetsInfo', () => {
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				rococo: {
					'2000': {
						foreignAssetsInfo,
						tokens: ['TST'],
						poolPairsInfo: {},
						specName: 'testy',
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.rococo['2000']).toStrictEqual({
			tokens: ['TST'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'testy',
			poolPairsInfo: {},
		});
	});
	it('Should correctly add an injectedRegistry only with tokens and specName', () => {
		const opts = {
			injectedRegistry: {
				westend: {
					'4000': {
						tokens: ['GRN'],
						specName: 'guarani',
						assetsInfo: {
							'5000': 'POTATO',
						},
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['4000']).toStrictEqual({
			tokens: ['GRN'],
			assetsInfo: {
				'5000': 'POTATO',
			},
			foreignAssetsInfo: {},
			specName: 'guarani',
			poolPairsInfo: {},
		});
	});
	it('Should correctly ignore the existing entries in assetsInfo and tokens', () => {
		const assetsInfo = {
			'0': 'POTATO',
			'1': 'L T',
			'2': 'RANOVER',
			'3': 'Meow',
			'4': 'HAPPY',
			'2511': 'TESTY',
			'3611': 'MATE',
		};
		const tokens = ['KSM'];
		const opts = {
			injectedRegistry: {
				kusama: {
					'1000': {
						tokens: tokens,
						assetsInfo: assetsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.kusama['1000'].assetsInfo['0']).toStrictEqual('DOG');
		expect(registry.kusama['1000'].assetsInfo['2511']).toStrictEqual('TESTY');
		expect(registry.kusama['1000'].assetsInfo['3611']).toStrictEqual('MATE');
	});
	it('Should correctly ignore the existing entries in tokens', () => {
		const tokens = ['GRN'];
		const opts = {
			injectedRegistry: {
				kusama: {
					'1000': {
						tokens: tokens,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.kusama['1000'].tokens).toStrictEqual(['KSM', 'GRN']);
	});
	it('Should correctly add the changes of poolPairsInfo', () => {
		const poolPairsInfo = {
			'6': {
				lpToken: '6',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"756"}]}}]]',
			},
			'7': {
				lpToken: '7',
				pairInfo: '[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X1":{"Parachain":"1300"}}}]]',
			},
		};
		const opts = {
			injectedRegistry: {
				westend: {
					'4000': {
						poolPairsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['4000'].poolPairsInfo).toStrictEqual({
			'6': {
				lpToken: '6',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"756"}]}}]]',
			},
			'7': {
				lpToken: '7',
				pairInfo: '[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X1":{"Parachain":"1300"}}}]]',
			},
		});
	});
	it('Should correctly add a new entry for poolPairsInfo', () => {
		const poolPairsInfo = {
			'8': {
				lpToken: '8',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"2511"}]}}]]',
			},
		};
		const opts = {
			injectedRegistry: {
				westend: {
					'4000': {
						poolPairsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['4000'].poolPairsInfo['8']).toStrictEqual({
			lpToken: '8',
			pairInfo:
				'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"2511"}]}}]]',
		});
	});
	it('Should correctly ignore existing entries for poolPairsInfo', () => {
		const poolPairsInfo = {
			'8': {
				lpToken: '8',
				pairInfo:
					'[[{"parents":"0","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"9999"}]}}]]',
			},
		};
		const opts = {
			injectedRegistry: {
				westend: {
					'4000': {
						poolPairsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.westend['4000'].poolPairsInfo['8']).toStrictEqual({
			lpToken: '8',
			pairInfo:
				'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"2511"}]}}]]',
		});
	});

	it('Should correctly ignore the new specName', () => {
		const specName = 'termo';
		const opts = {
			injectedRegistry: {
				rococo: {
					'0': {
						specName: specName,
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.rococo['0']).toStrictEqual({
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'rococo',
		});
	});
	it('Should correctly add a new chain', () => {
		const specName = 'termo';
		const opts = {
			injectedRegistry: {
				rococo: {
					'4000': {
						tokens: ['TRM'],
						specName: specName,
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.rococo['4000']).toStrictEqual({
			tokens: ['TRM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'termo',
		});
	});
	it('Should error when adding a new chain without specName', () => {
		const opts = {
			injectedRegistry: {
				rococo: {
					'6666': {
						tokens: ['ISX'],
					},
				},
			},
		};
		const err = () => parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(err).toThrow('SpecNameNotProvided');
	});
	it('Should correctly add a new foreignAsset ignoring the specName', () => {
		const specName = 'prorrata';
		const foreignAssetsInfo = {
			TESTY: {
				symbol: 'TSTY',
				name: 'Testy',
				multiLocation: '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Testy"}}}',
			},
		};
		const opts = {
			injectedRegistry: {
				rococo: {
					'4000': {
						specName,
						foreignAssetsInfo,
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.rococo['4000']).toStrictEqual({
			tokens: ['TRM'],
			assetsInfo: {},
			foreignAssetsInfo: {
				TESTY: {
					symbol: 'TSTY',
					name: 'Testy',
					multiLocation: '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Testy"}}}',
				},
			},
			poolPairsInfo: {},
			specName: 'termo',
		});
	});
	it('Should correctly add a new xcAsset ignoring the specName', () => {
		const specName = 'prorrata';
		const xcAssetsData = [
			{
				paraID: 1000,
				symbol: 'RMRK',
				decimals: 10,
				xcmV1MultiLocation:
					'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]}}}',
				asset: {
					Token: 'RMRK',
				},
			},
			{
				paraID: 1000,
				symbol: 'USDT',
				decimals: 6,
				xcmV1MultiLocation:
					'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
				asset: {
					Token2: '0',
				},
			},
		];
		const opts = {
			injectedRegistry: {
				rococo: {
					'4000': {
						specName,
						xcAssetsData,
					},
				},
			},
		};
		const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

		expect(registry.rococo['4000']).toStrictEqual({
			tokens: ['TRM'],
			assetsInfo: {},
			foreignAssetsInfo: {
				TESTY: {
					symbol: 'TSTY',
					name: 'Testy',
					multiLocation: '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Testy"}}}',
				},
			},
			poolPairsInfo: {},
			xcAssetsData: [
				{
					paraID: 1000,
					symbol: 'RMRK',
					decimals: 10,
					xcmV1MultiLocation:
						'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]}}}',
					asset: {
						Token: 'RMRK',
					},
				},
				{
					paraID: 1000,
					symbol: 'USDT',
					decimals: 6,
					xcmV1MultiLocation:
						'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
					asset: {
						Token2: '0',
					},
				},
			],
			specName: 'termo',
		});
	});
});
it('Should correctly add a new xcAsset ignoring the existing one', () => {
	const specName = 'prorrata';
	const xcAssetsData = [
		{
			paraID: 1000,
			symbol: 'RMRK',
			decimals: 10,
			xcmV1MultiLocation:
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]}}}',
			asset: {
				Token: 'RMRK',
			},
		},
		{
			paraID: 1230,
			symbol: 'USDT',
			decimals: 7,
			xcmV1MultiLocation:
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
			asset: {
				Token2: '0',
			},
		},
	];
	const opts = {
		injectedRegistry: {
			rococo: {
				'4000': {
					specName,
					xcAssetsData,
				},
			},
		},
	};
	const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, opts);

	expect(registry.rococo['4000'].xcAssetsData).toStrictEqual([
		{
			paraID: 1000,
			symbol: 'RMRK',
			decimals: 10,
			xcmV1MultiLocation:
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]}}}',
			asset: {
				Token: 'RMRK',
			},
		},
		{
			paraID: 1000,
			symbol: 'USDT',
			decimals: 6,
			xcmV1MultiLocation:
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
			asset: {
				Token2: '0',
			},
		},
		{
			paraID: 1230,
			symbol: 'USDT',
			decimals: 7,
			xcmV1MultiLocation:
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
			asset: {
				Token2: '0',
			},
		},
	]);
});
