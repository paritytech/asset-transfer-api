import { Registry } from './Registry';
import type { ForeignAssetsData } from './types';

describe('Registry', () => {
	const registry = new Registry('polkadot', {});
	describe('initialization', () => {
		it('Should initalize rococo correctly', () => {
			const registry = new Registry('rococo', {});
			expect(registry.relayChain).toEqual('rococo');
		});
	});
	describe('lookupTokenSymbol', () => {
		it('Should return the correct result', () => {
			const res = registry.lookupTokenSymbol('GLMR');
			const expected = [
				{
					tokens: ['GLMR'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					specName: 'moonbeam',
					chainId: '2004',
					poolPairsInfo: {},
					xcAssetsData: [
						{
							asset: '42259045809535163221576417993425387648',
							decimals: 10,
							paraID: 0,
							symbol: 'DOT',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"here":null}}}',
						},
						{
							asset: '311091173110107856861649819128533077277',
							decimals: 6,
							paraID: 1000,
							symbol: 'USDT',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
						},
						{
							asset: '110021739665376159354538090254163045594',
							decimals: 12,
							paraID: 2000,
							symbol: 'aUSD',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2000},{"generalKey":"0x0001"}]}}}',
						},
						{
							asset: '224821240862170613278369189818311486111',
							decimals: 12,
							paraID: 2000,
							symbol: 'ACA',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2000},{"generalKey":"0x0000"}]}}}',
						},
						{
							asset: '224077081838586484055667086558292981199',
							decimals: 18,
							paraID: 2006,
							symbol: 'ASTR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2006}}}}',
						},
						{
							asset: '187224307232923873519830480073807488153',
							decimals: 9,
							paraID: 2011,
							symbol: 'EQD',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2011},{"generalKey":"0x657164"}]}}}',
						},
						{
							asset: '190590555344745888270686124937537713878',
							decimals: 9,
							paraID: 2011,
							symbol: 'EQ',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2011}}}}',
						},
						{
							asset: '32615670524745285411807346420584982855',
							decimals: 12,
							paraID: 2012,
							symbol: 'PARA',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2012},{"generalKey":"0x50415241"}]}}}',
						},
						{
							asset: '309163521958167876851250718453738106865',
							decimals: 11,
							paraID: 2026,
							symbol: 'NODL',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2026},{"palletInstance":2}]}}}',
						},
						{
							asset: '144012926827374458669278577633504620722',
							decimals: 18,
							paraID: 2030,
							symbol: 'FIL',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0804"}]}}}',
						},
						{
							asset: '29085784439601774464560083082574142143',
							decimals: 10,
							paraID: 2030,
							symbol: 'vDOT',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0900"}]}}}',
						},
						{
							asset: '204507659831918931608354793288110796652',
							decimals: 18,
							paraID: 2030,
							symbol: 'vGLMR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0901"}]}}}',
						},
						{
							asset: '165823357460190568952172802245839421906',
							decimals: 12,
							paraID: 2030,
							symbol: 'BNC',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0001"}]}}}',
						},
						{
							asset: '272547899416482196831721420898811311297',
							decimals: 18,
							paraID: 2030,
							symbol: 'vFIL',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0904"}]}}}',
						},
						{
							asset: '91372035960551235635465443179559840483',
							decimals: 18,
							paraID: 2031,
							symbol: 'CFG',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2031},{"generalKey":"0x0001"}]}}}',
						},
						{
							asset: '120637696315203257380661607956669368914',
							decimals: 8,
							paraID: 2032,
							symbol: 'IBTC',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0001"}]}}}',
						},
						{
							asset: '101170542313601871197860408087030232491',
							decimals: 10,
							paraID: 2032,
							symbol: 'INTR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0002"}]}}}',
						},
						{
							asset: '69606720909260275826784788104880799692',
							decimals: 12,
							paraID: 2034,
							symbol: 'HDX',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2034},{"generalIndex":0}]}}}',
						},
						{
							asset: '132685552157663328694213725410064821485',
							decimals: 12,
							paraID: 2035,
							symbol: 'PHA',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2035}}}}',
						},
						{
							asset: '125699734534028342599692732320197985871',
							decimals: 18,
							paraID: 2046,
							symbol: 'RING',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2046},{"palletInstance":5}]}}}',
						},
						{
							asset: '89994634370519791027168048838578580624',
							decimals: 10,
							paraID: 2101,
							symbol: 'SUB',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2101}}}}',
						},
						{
							asset: '166446646689194205559791995948102903873',
							decimals: 18,
							paraID: 2104,
							symbol: 'MANTA',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2104}}}}',
						},
					],
				},
			];
			expect(res).toEqual(expected);
		});
	});
	describe('lookupAssetId', () => {
		it('Should return the correct result', () => {
			const res = registry.lookupAssetId('1984');
			const expected = [
				{
					tokens: ['DOT'],
					assetsInfo: {
						'1': 'no1',
						'2': 'BTC',
						'3': 'DOT',
						'4': 'EFI',
						'5': 'PLX',
						'6': 'LPHP',
						'7': 'lucky7',
						'8': 'JOE',
						'9': 'PINT',
						'10': 'BEAST',
						'11': 'web3',
						'12': 'USDcp',
						'15': 'Meme',
						'21': 'WBTC',
						'77': 'TRQ',
						'99': 'Cypress',
						'100': 'WETH',
						'101': 'DOTMA',
						'123': '123',
						'256': 'ICE',
						'666': 'DANGER',
						'777': '777',
						'999': 'gold',
						'1000': 'BRZ',
						'1337': 'USDC',
						'1984': 'USDt',
						'862812': 'CUBO',
						'868367': 'VSC',
						'20090103': 'BTC',
					},
					specName: 'statemint',
					chainId: '1000',
					poolPairsInfo: {},
					foreignAssetsInfo: {
						'0x02010903': {
							multiLocation: '{"parents":2,"interior":{"x1":{"globalConsensus":{"kusama":null}}}}',
							name: '',
							symbol: '',
						},
					},
				},
			];
			expect(res).toEqual(expected);
		});
	});
	describe('lookupParachainId', () => {
		it('Should return the correct result', () => {
			const res1 = registry.lookupParachainId('1000');
			const res2 = registry.lookupParachainId('999999');

			expect(res1).toEqual(true);
			expect(res2).toEqual(false);
		});
	});
	describe('lookupParachainInfo', () => {
		it('Should return the correct result', () => {
			const res = registry.lookupParachainInfo('2000');
			const expected = [
				{
					tokens: ['ACA', 'AUSD', 'DOT', 'LDOT'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					specName: 'acala',
					chainId: '2000',
					poolPairsInfo: {},
					xcAssetsData: [
						{
							asset: {
								ForeignAsset: '12',
							},
							decimals: 6,
							paraID: 1000,
							symbol: 'USDT',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
						},
						{
							asset: {
								ForeignAsset: '6',
							},
							decimals: 18,
							paraID: 1000,
							symbol: 'WETH',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":100}]}}}',
						},
						{
							asset: {
								ForeignAsset: '5',
							},
							decimals: 8,
							paraID: 1000,
							symbol: 'WBTC',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":21}]}}}',
						},
						{
							asset: {
								ForeignAsset: '0',
							},
							decimals: 18,
							paraID: 2004,
							symbol: 'GLMR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2004},{"palletInstance":10}]}}}',
						},
						{
							asset: {
								ForeignAsset: '2',
							},
							decimals: 18,
							paraID: 2006,
							symbol: 'ASTR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2006}}}}',
						},
						{
							asset: {
								ForeignAsset: '11',
							},
							decimals: 12,
							paraID: 2008,
							symbol: 'CRU',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2008}}}}',
						},
						{
							asset: {
								ForeignAsset: '8',
							},
							decimals: 9,
							paraID: 2011,
							symbol: 'EQD',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2011},{"generalKey":"0x657164"}]}}}',
						},
						{
							asset: {
								ForeignAsset: '7',
							},
							decimals: 9,
							paraID: 2011,
							symbol: 'EQ',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2011}}}}',
						},
						{
							asset: {
								ForeignAsset: '1',
							},
							decimals: 12,
							paraID: 2012,
							symbol: 'PARA',
							xcmV1MultiLocation:
								'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2012},{"generalKey":"0x50415241"}]}}}',
						},
						{
							asset: {
								ForeignAsset: '3',
							},
							decimals: 8,
							paraID: 2032,
							symbol: 'IBTC',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0001"}]}}}',
						},
						{
							asset: {
								ForeignAsset: '4',
							},
							decimals: 10,
							paraID: 2032,
							symbol: 'INTR',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0002"}]}}}',
						},
						{
							asset: {
								ForeignAsset: '9',
							},
							decimals: 12,
							paraID: 2035,
							symbol: 'PHA',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2035}}}}',
						},
						{
							asset: {
								ForeignAsset: '10',
							},
							decimals: 18,
							paraID: 2037,
							symbol: 'UNQ',
							xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x1":{"parachain":2037}}}}',
						},
					],
				},
			];
			expect(res).toEqual(expected);
		});
	});
	describe('lookupChainIdBySpecName', () => {
		it('Should return the correct result', () => {
			const res = registry.lookupChainIdBySpecName('moonbeam');
			expect(res).toEqual('2004');
		});
		it('Should correctly cache specNames when they have Ids', () => {
			registry.lookupChainIdBySpecName('statemint');
			registry.lookupChainIdBySpecName('moonbeam');
			registry.lookupChainIdBySpecName('acala');
			expect(registry.specNameToIdCache.has('statemint')).toEqual(true);
			expect(registry.specNameToIdCache.has('moonbeam')).toEqual(true);
			expect(registry.specNameToIdCache.has('acala')).toEqual(true);
		});
	});
	describe('Registry cache', () => {
		it('Should correctly add an asset to the assetsInfo cache ', () => {
			registry.setAssetInCache('1984', 'USDt');

			expect(registry.cacheLookupAsset('1984') as string).toEqual('USDt');
		});
		it('Should correctly add an asset to the poolPairsInfo cache', () => {
			const poolAssetData = {
				lpToken: '0',
				pairInfo: 'testPoolAssetData',
			};
			registry.setLiquidPoolTokenInCache('0', poolAssetData);

			expect(registry.cacheLookupPoolAsset('0')).toEqual(poolAssetData);
		});
		it('Should correctly add an asset to the foreignAssetsInfo cache', () => {
			const foreignAssetData: ForeignAssetsData = {
				symbol: 'TNKR',
				name: 'Tinkernet',
				multiLocation: '{"parents":1,"interior":{"x2":[{"parachain":2125},{"generalIndex":0}]}}',
			};
			registry.setForeignAssetInCache('TNKR', foreignAssetData);

			expect(registry.cacheLookupForeignAsset('TNKR')).toEqual(foreignAssetData);
		});
	});
});
