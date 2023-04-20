// Copyright 2023 Parity Technologies (UK) Ltd.

import { parseRegistry } from './parseRegistry';

describe('parseRegistry', () => {
	it('Should return the correct object structure', () => {
		const registry = parseRegistry();

		expect(registry.polkadot['0'].tokens).toStrictEqual(['DOT']);
		expect(registry.kusama['0'].tokens).toStrictEqual(['KSM']);
		expect(registry.westend['0'].tokens).toStrictEqual(['WND']);
	});
});
