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
	it('Should correctly discover the right relay chain when using asset-hub specNames', () => {
		const findPolkadot = findRelayChain('asset-hub-polkadot', registry);
		const findKusama = findRelayChain('asset-hub-kusama', registry);
		const findWestend = findRelayChain('asset-hub-westend', registry);

		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
	});
});
