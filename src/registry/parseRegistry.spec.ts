// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockAssetRegistry } from "../testHelpers/mockAssetRegistry";
import { parseRegistry } from "./parseRegistry";

const injectedRegistry = {
	injectedRegistry: mockAssetRegistry
}
describe('parseRegistry', () => {
	it('Should return the correct object structure', async () => {
		const registry = await parseRegistry(injectedRegistry);

		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
		expect(registry.kusama['0'].tokens).toStrictEqual(['KSM']);
		expect(registry.westend['0'].tokens).toStrictEqual(['WND']);
		expect(registry.rococo['0'].tokens).toStrictEqual(['ROC']);
	});
	it('Should correctly overwrite rococos asset-hub specName', async () => {
		const registry = await parseRegistry(injectedRegistry);
		expect(registry.rococo['1000'].specName).toEqual('asset-hub-rococo');
	});
	it('Should correctly inject an injectedRegsitry', async () => {
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
		const registry = await parseRegistry(opts);

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
});
