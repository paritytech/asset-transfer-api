// Copyright 2024 Parity Technologies (UK) Ltd.

import { chainDestIsBridge } from './chainDestIsBridge';

describe('chainDestIsBridge', () => {
	it('Should correctly return true for a GlobalConsensus destination location', () => {
		const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;

		const result = chainDestIsBridge(destLocation);

		expect(result).toEqual(true);
	});
	it('Should correctly return false for a destination location that does not contain a GlobalConsensus junction', () => {
		const destLocation = `{"parents":"2","interior":{"X1":{"Parachain":"2030"}}}`;

		const result = chainDestIsBridge(destLocation);

		expect(result).toEqual(false);
	});
});
