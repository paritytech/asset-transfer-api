// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { getChainIdBySpecName } from './getChainIdBySpecName';

type Test = [expected: string, specName: string, registry: Registry];

describe('getChainIdBySpecName', () => {
	it('should return the correct chainId when given a valid specName', () => {
		const tests: Test[] = [
			['0', 'kusama', new Registry('kusama', {})],
			['1000', 'statemine', new Registry('statemine', {})],
			['1001', 'collectives', new Registry('collectives', {})],
			['1002', 'bridge-hub-kusama', new Registry('bridge-hub-kusama', {})],
		];

		for (const test of tests) {
			const [expected, specName, registry] = test;

			const result = getChainIdBySpecName(registry, specName);
			expect(result).toEqual(expected);
		}
	});
});
