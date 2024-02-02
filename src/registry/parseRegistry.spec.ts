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
	it('Should correctly update the registry with an injectedRegsitry without tokens', () => {
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
			specName: 'totoro',
			poolPairsInfo: {},
		});
	});
	it('Should correctly error when a previously missing injectedRegsitry is added without a token', () => {
		const expectedErrorMessage = `Must define the tokens property`;

		const assetsInfo = {};
		const foreignAssetsInfo = {};
		const opts = {
			injectedRegistry: {
				westend: {
					'3000': {
						assetsInfo,
						foreignAssetsInfo,
						poolPairsInfo: {},
						specName: 'totoro',
					},
				},
			},
		};

		const err = () => parseRegistry(reg as ChainInfoRegistry, opts);
		expect(err).toThrow(expectedErrorMessage);
	});
	it("Should correctly override the registry's token entry with an injectedRegsitry", () => {
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
			tokens: ['WOP'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			specName: 'totoro',
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
});
