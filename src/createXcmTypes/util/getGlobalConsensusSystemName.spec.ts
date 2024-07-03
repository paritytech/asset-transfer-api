// Copyright 2024 Parity Technologies (UK) Ltd.

import { getGlobalConsensusSystemName } from './getGlobalConsensusSystemName';

describe('getGlobalConsensusSystemName', () => {
	describe('X1', () => {
		it('Should correctly return the consensus system name for Polkadot', () => {
			const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`;

			const result = getGlobalConsensusSystemName(destLocation);

			expect(result).toEqual('polkadot');
		});
		it('Should correctly return the consensus system name for Kusama', () => {
			const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`;

			const result = getGlobalConsensusSystemName(destLocation);

			expect(result).toEqual('kusama');
		});
		it('Should correctly return the consensus system name for Ethereum', () => {
			const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;

			const result = getGlobalConsensusSystemName(destLocation);

			expect(result).toEqual('ethereum');
		});
	});
	describe('X2', () => {
		it('Should correctly return the consensus system name for Polkadot AssetHub', () => {
			const destLocation = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`;

			const result = getGlobalConsensusSystemName(destLocation);

			expect(result).toEqual('polkadot');
		});
		it('Should correctly return the consensus system name for Kusama AssetHub', () => {
			const destLocation = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}`;

			const result = getGlobalConsensusSystemName(destLocation);

			expect(result).toEqual('kusama');
		});
	});
	it('Should correctly throw an error when no valid consensus system name is found', () => {
		const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Cosmos":{"chainId":"0"}}}}}`;

		const err = () => getGlobalConsensusSystemName(destLocation);

		expect(err).toThrow(
			`No known consensus system found for location {"parents":"2","interior":{"X1":{"GlobalConsensus":{"Cosmos":{"chainId":"0"}}}}}`,
		);
	});
});
