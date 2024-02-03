// Copyright 2023 Parity Technologies (UK) Ltd.

import reg from '@substrate/asset-transfer-api-registry';

import { parseRegistry } from './parseRegistry';
import { ChainInfoRegistry } from './types';

describe('parseRegistry', () => {
	it('Should return the correct object structure', () => {
		const registry = parseRegistry(reg as ChainInfoRegistry, {});

		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
		expect(registry.kusama['0'].tokens).toStrictEqual(['KSM']);
		expect(registry.westend['0'].tokens).toStrictEqual(['WND']);
		expect(registry.rococo['0'].tokens).toStrictEqual(['ROC']);
	});
	it('Should correctly overwrite rococos asset-hub specName', () => {
		const registry = parseRegistry(reg as ChainInfoRegistry, {});
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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.westend['4000']).toStrictEqual({
			tokens: ['GRN'],
			assetsInfo: {},
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

		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.kusama['1000'].assetsInfo).toStrictEqual({
			'0': 'DOG',
			'1': 'L T',
			'2': 'PNN',
			'3': 'Meow',
			'4': 'HAPPY',
			'5': 'BEER',
			'6': 'ZKPD',
			'7': 'DOS',
			'8': 'RMRK',
			'9': 'TOT',
			'10': 'USDC',
			'11': 'USDT',
			'12': 'BUSD',
			'13': 'LN',
			'14': 'DOT',
			'15': 'Web3',
			'16': 'ARIS',
			'17': 'MEME',
			'18': 'HEI',
			'19': 'SHOT',
			'20': 'BFKK',
			'21': 'ELEV',
			'22': 'STH',
			'23': 'KOJO',
			'24': 'test',
			'25': 'BABE',
			'26': 'BUNGA',
			'27': 'RUNE',
			'28': 'LAC',
			'29': 'CODES',
			'30': 'GOL',
			'31': 'ki',
			'32': 'FAV',
			'33': 'BUSSY',
			'34': 'PLX',
			'35': 'LUCKY',
			'36': 'RRT',
			'37': 'MNCH',
			'38': 'ENT',
			'39': 'DSCAN',
			'40': 'ERIC',
			'41': 'GOOSE',
			'42': 'NRNF',
			'43': 'TTT',
			'44': 'ADVNCE',
			'45': 'CRIB',
			'46': 'FAN',
			'47': 'EUR',
			'49': 'DIAN',
			'50': 'PROMO',
			'55': 'MTS',
			'60': 'GAV',
			'61': 'CRY',
			'64': 'oh!',
			'66': 'DAI',
			'68': 'ADVERT',
			'69': 'NICE',
			'71': 'OAK',
			'75': 'cipher',
			'77': 'Crypto',
			'87': 'XEXR',
			'88': 'BTC',
			'90': 'SATS',
			'91': 'TMJ',
			'99': 'BITCOIN',
			'100': 'Chralt',
			'101': '---',
			'102': 'DRX',
			'111': 'NO1',
			'117': 'TNKR',
			'123': 'NFT',
			'138': 'Abc',
			'168': 'Tokens',
			'188': 'ZLK',
			'200': 'SIX',
			'214': 'LOVE',
			'222': 'PNEO',
			'223': 'BILL',
			'224': 'SIK',
			'300': 'PWS',
			'333': 'Token',
			'345': '345',
			'360': 'uni',
			'365': 'time',
			'374': 'wETH',
			'377': 'KAA',
			'383': 'KODA',
			'404': 'MAXI',
			'420': 'BLAZE',
			'520': '0xe299a5e299a5e299a5',
			'555': 'GAME',
			'567': 'CHRWNA',
			'569': 'KUSA',
			'598': 'EREN',
			'666': 'BAD',
			'677': 'GRB',
			'756': 'TSM',
			'759': 'bLd',
			'777': 'GOD',
			'813': 'TBUX',
			'841': 'YAYOI',
			'888': 'LUCK',
			'911': '911',
			'999': 'CBDC',
			'1000': 'SPARK',
			'1107': 'HOLIC',
			'1111': 'MTVD',
			'1123': 'XEN',
			'1155': 'WITEK',
			'1225': 'GOD',
			'1234': 'KSM',
			'1313': 'TACP',
			'1337': 'TIP',
			'1420': 'HYDR',
			'1441': 'SPOT',
			'1526': 'bcd',
			'1607': 'STRGZN',
			'1688': 'ali',
			'1984': 'USDt',
			'1999': 'ADVERT2',
			'2021': 'WAVE',
			'2048': 'RWS',
			'2049': 'Android',
			'2050': 'CUT',
			'2077': 'XRT',
			'2323': 'Tsn',
			'3000': 'GRAIN',
			'3001': 'DUCK',
			'3077': 'ACT',
			'3327': 'MVPW',
			'3328': 'A42',
			'3611': 'MATE',
			'3721': 'fast',
			'3913': 'KAI ',
			'3943': 'GMK',
			'6789': 'VHM',
			'6967': 'CHAOS',
			'7777': 'lucky7',
			'8848': 'top',
			'9000': 'KPOTS',
			'9999': 'BTC',
			'11111': 'KVC',
			'12345': 'DREX',
			'19840': 'USDt',
			'22060': 'RON',
			'42069': 'INTRN',
			'69420': 'CHAOS',
			'80815': 'KSMFS',
			'80816': 'RUEPP',
			'80817': 'FRALEY',
			'88888': 'BAILEGO',
			'95834': 'LUL',
			'131313': 'DMO',
			'220204': 'STM',
			'314159': 'RTT',
			'777777': 'DEFI',
			'862812': 'CUBO',
			'863012': 'VCOP',
			'2284739': 'ETAR',
			'4206969': 'SHIB',
			'5201314': 'belove',
			'5797867': 'TAKE',
			'7777777': 'king',
			'4294967291': 'PRIME',
			'2511': 'TESTY',
		});
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

		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.kusama['1000'].tokens).toStrictEqual(['KSM', 'GRN']);

		expect(registry.kusama['1000'].poolPairsInfo).toStrictEqual({
			'0': {
				lpToken: '0',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"5797867"}]}}]]',
			},
			'1': {
				lpToken: '1',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}]]',
			},
			'2': {
				lpToken: '2',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1313"}]}}]]',
			},
			'3': {
				lpToken: '3',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3327"}]}}]]',
			},
			'4': {
				lpToken: '4',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3328"}]}}]]',
			},
			'5': {
				lpToken: '5',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"131313"}]}}]]',
			},
			'6': {
				lpToken: '6',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"756"}]}}]]',
			},
			'7': {
				lpToken: '7',
				pairInfo: '[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X1":{"Parachain":"2123"}}}]]',
			},
		});
	});
	it('Should correctly ignore the changes in existing entries of poolPairsInfo', () => {
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
				kusama: {
					'1000': {
						poolPairsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.kusama['1000'].poolPairsInfo).toStrictEqual({
			'0': {
				lpToken: '0',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"5797867"}]}}]]',
			},
			'1': {
				lpToken: '1',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}]]',
			},
			'2': {
				lpToken: '2',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1313"}]}}]]',
			},
			'3': {
				lpToken: '3',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3327"}]}}]]',
			},
			'4': {
				lpToken: '4',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3328"}]}}]]',
			},
			'5': {
				lpToken: '5',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"131313"}]}}]]',
			},
			'6': {
				lpToken: '6',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"756"}]}}]]',
			},
			'7': {
				lpToken: '7',
				pairInfo: '[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X1":{"Parachain":"2123"}}}]]',
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
				kusama: {
					'1000': {
						poolPairsInfo,
					},
				},
			},
		};

		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.kusama['1000'].poolPairsInfo).toStrictEqual({
			'0': {
				lpToken: '0',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"5797867"}]}}]]',
			},
			'1': {
				lpToken: '1',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}]]',
			},
			'2': {
				lpToken: '2',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1313"}]}}]]',
			},
			'3': {
				lpToken: '3',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3327"}]}}]]',
			},
			'4': {
				lpToken: '4',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"3328"}]}}]]',
			},
			'5': {
				lpToken: '5',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"131313"}]}}]]',
			},
			'6': {
				lpToken: '6',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"756"}]}}]]',
			},
			'7': {
				lpToken: '7',
				pairInfo: '[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X1":{"Parachain":"2123"}}}]]',
			},
			'8': {
				lpToken: '8',
				pairInfo:
					'[[{"parents":"1","interior":"Here"},{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"2511"}]}}]]',
			},
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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

		expect(registry.rococo['4000']).toStrictEqual({
			tokens: ['TRM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'termo',
		});
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
		const registry = parseRegistry(reg as ChainInfoRegistry, opts);

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
});
