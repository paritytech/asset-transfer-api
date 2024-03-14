// Copyright 2023 Parity Technologies (UK) Ltd.

import reg from '@substrate/asset-transfer-api-registry';

import { findRelayChain } from './findRelayChain';
import { parseRegistry } from './parseRegistry';
import { ChainInfoKeys, ChainInfoRegistry } from './types';

describe('findRelayChain', () => {
	const registry = parseRegistry(reg as ChainInfoRegistry<ChainInfoKeys>, {});
	it('Should correctly discover the right relay chain', () => {
		const findPolkadot = findRelayChain('statemint', registry);
		const findKusama = findRelayChain('statemine', registry);
		const findWestend = findRelayChain('westmint', registry);
		const findRococo = findRelayChain('statemine', registry, 'Rococo Asset Hub');

		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
		expect(findRococo).toEqual('rococo');
	});
	it('Should correctly discover the right relay chain when using asset-hub specNames', () => {
		const findPolkadot = findRelayChain('asset-hub-polkadot', registry);
		const findKusama = findRelayChain('asset-hub-kusama', registry);
		const findWestend = findRelayChain('asset-hub-westend', registry);
		const findRococo = findRelayChain('asset-hub-rococo', registry, 'Rococo Asset Hub');


		expect(findPolkadot).toEqual('polkadot');
		expect(findKusama).toEqual('kusama');
		expect(findWestend).toEqual('westend');
		expect(findRococo).toEqual('rococo');
	});
});
