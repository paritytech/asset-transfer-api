// Copyright 2024 Parity Technologies (UK) Ltd.

import { InteriorValue } from '../types';
import { getGlobalConsensusDestFromLocation } from './getGlobalConsensusDestFromLocation';

describe('getGlobalConsensusDestFromLocation', () => {
	it('Should correctly retrieve the global consensus dest based on the location for Polkadot', () => {
		const locationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`;
		const xcmVersion = 4;

		const expected: InteriorValue = {
			GlobalConsensus: 'Polkadot',
		};

		const result = getGlobalConsensusDestFromLocation(locationStr, xcmVersion);

		expect(result).toEqual(expected);
	});
	it('Should correctly retrieve the global consensus dest based on the location for Kusama', () => {
		const locationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`;
		const xcmVersion = 3;
		const expected: InteriorValue = {
			GlobalConsensus: 'Kusama',
		};

		const result = getGlobalConsensusDestFromLocation(locationStr, xcmVersion);

		expect(result).toEqual(expected);
	});
	it('Should correctly retrieve the global consensus dest based on the location for Ethereum', () => {
		const locationStr = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`;
		const xcmVersion = 4;

		const expected: InteriorValue = {
			GlobalConsensus: {
				Ethereum: {
					chainId: '11155111',
				},
			},
		};

		const result = getGlobalConsensusDestFromLocation(locationStr, xcmVersion);

		expect(result).toEqual(expected);
	});
	it('Should correctly throw an error when a location is provided that does not contain a GlobalConsensus destination junction value', () => {
		const locationStr = `{"parents":"1","interior":{"X1":{"Parachain":"2030"}}}`;
		const xcmVersion = 3;

		const err = () => getGlobalConsensusDestFromLocation(locationStr, xcmVersion);

		expect(err).toThrow(
			`Bridge transaction location {"parents":"1","interior":{"X1":{"Parachain":"2030"}}} does not contain a GlobalConsensus Junction`,
		);
	});
	it('Should correctly throw an error when a location is provided that does not contain a valid GlobalConsensus at the 0 index', () => {
		const locationStr = `{"parents":"1","interior":{"X2":[{"Parachain":"2030"},{"GlobalConsensus":"Kusama"}]}}`;
		const xcmVersion = 4;

		const err = () => getGlobalConsensusDestFromLocation(locationStr, xcmVersion);

		expect(err).toThrow(
			`Bridge transaction location interior {"X2":[{"Parachain":"2030"},{"GlobalConsensus":"Kusama"}]} does not contain a GlobalConsensus Junction in the first index`,
		);
	});
});
