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
	it('Should correctly update the registry with an injectedRegsitry', () => {
		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				westend: {
					'0': {
						tokens: ['WND', 'WND2'],
						assetsInfo,
						foreignAssetsInfo,
						specName: 'westmint',
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
			specName: 'westmint',
			poolPairsInfo: {},
		});
		// Ensure nothing was overwritten
		// expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
	});
});
