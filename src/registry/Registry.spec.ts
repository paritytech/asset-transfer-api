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
			expect(res[0].tokens).toEqual(['GLMR']);
		});
	});
	describe('lookupAssetId', () => {
		it('Should return the correct result', () => {
			const res = registry.lookupAssetId('1984');
			expect(res[0].tokens).toEqual(['DOT']);
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
			expect(res[0].tokens).toEqual(['ACA', 'AUSD', 'DOT', 'LDOT']);
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
