// Copyright 2023 Parity Technologies (UK) Ltd.

import { assetDestIsBridge } from './assetDestIsBridge';

describe('assetDestIsBridge', () => {
	it('Should correctly return false for a assetId of 1984', () => {
		const result = assetDestIsBridge(['1984']);

		expect(result).toEqual(false);
	});
    it('Should correctly return false for a non global consensus assetId location', () => {
		const result = assetDestIsBridge([`{"parents":"1","interior":"Here"}}`]);

		expect(result).toEqual(false);
	});
	it('Should correctly return true for an Ethereum assetId location containing a global consenus junction', () => {
		const result = assetDestIsBridge([`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`]);

		expect(result).toEqual(true);
	});
	it('Should correctly return true for a Kusama assetId location containing a global consensus junction', () => {
		const result = assetDestIsBridge([`{"parents":"1","interior":{"x1":{"GlobalConsensus":"Kusama"}}}`]);

		expect(result).toEqual(true);
	});
});
