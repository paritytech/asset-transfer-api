import { Registry } from './Registry';

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
});
