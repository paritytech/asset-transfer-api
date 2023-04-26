import { findRelayChain } from './findRelayChain';
import { parseRegistry } from './parseRegistry';

describe('findRelayChain', () => {
	const registry = parseRegistry({});
	it('Should correctly discover the right relay chain', () => {
		const findPolkadot = findRelayChain('statemint', registry);
		const findKusama = findRelayChain('statemine', registry);
		const findWestend = findRelayChain('westmint', registry);

		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
	});
});
