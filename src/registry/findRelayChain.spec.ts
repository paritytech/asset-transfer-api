import { findRelayChain } from './findRelayChain';
import { mockAssetRegistry } from '../testHelpers/mockAssetRegistry';

describe('findRelayChain', () => {
	it('Should correctly discover the right relay chain', () => {
		const findPolkadot = findRelayChain('statemint', mockAssetRegistry);
		const findKusama = findRelayChain('statemine', mockAssetRegistry);
		const findWestend = findRelayChain('westmint', mockAssetRegistry);

		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
	});
	it('Should correctly discover the right relay chain when using asset-hub specNames', () => {
		const findPolkadot = findRelayChain('asset-hub-polkadot', mockAssetRegistry);
		const findKusama = findRelayChain('asset-hub-kusama', mockAssetRegistry);
		const findWestend = findRelayChain('asset-hub-westend', mockAssetRegistry);

		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
	});
});
