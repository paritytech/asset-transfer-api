// Copyright 2023 Parity Technologies (UK) Ltd.

import { parseRegistry } from './parseRegistry';

describe('parseRegistry', () => {
	it('Should return the correct object structure', () => {
		const registry = parseRegistry({});

		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
		expect(registry.kusama['0'].tokens).toStrictEqual(['KSM']);
		expect(registry.westend['0'].tokens).toStrictEqual(['WND']);
	});

	it('Should correctly inject an injectedRegsitry', () => {
		const opts = {
			injectedRegistry: {
				polkadot: {
					'9876': {
						tokens: ['TST'],
						specName: 'testing',
					},
				},
			},
		};
		const registry = parseRegistry(opts);

		expect(registry.polkadot['9876']).toStrictEqual({
			tokens: ['TST'],
			specName: 'testing',
		});
		// Ensure nothing was overwritten
		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
	});
});
