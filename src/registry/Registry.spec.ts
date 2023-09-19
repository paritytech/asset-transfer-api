import { Registry } from './Registry';
import type { ForeignAssetsData } from './types';

describe('Registry', () => {
	const registry = new Registry('polkadot', {});
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
					assetsPalletInstance: '104',
					foreignAssetsPalletInstance: null,
					poolPairsInfo: {},
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
					foreignAssetsInfo: {},
					specName: 'statemint',
					chainId: '1000',
					assetsPalletInstance: '50',
					foreignAssetsPalletInstance: '53',
					poolPairsInfo: {},
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
					assetsPalletInstance: null,
					foreignAssetsPalletInstance: null,
					poolPairsInfo: {},
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
			registry.lookupChainIdBySpecName('moonbeam');
			expect(registry.specNameToIdCache.has('moonbeam')).toEqual(true);
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
