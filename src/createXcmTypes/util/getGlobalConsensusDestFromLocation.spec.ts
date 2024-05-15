// Copyright 2024 Parity Technologies (UK) Ltd.

import { getGlobalConsensusDestFromLocation } from './getGlobalConsensusDestFromLocation';

describe('getGlobalConsensusDestFromLocation', () => {
	it('Should correctly retrieve the global consensus dest based on the location for Polkadot', () => {
		const locationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`;

		const expected = {
			parents: '2',
			interior: {
				X2: [
					{
						GlobalConsensus: 'Polkadot',
					},
					{
						Parachain: '1000',
					},
				],
			},
		};

		const result = getGlobalConsensusDestFromLocation(locationStr);

		expect(result).toEqual(expected);
	});
	it('Should correctly retrieve the global consensus dest based on the location for Kusama', () => {
		const locationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`;
		const expected = {
			parents: '2',
			interior: {
				X2: [
					{
						GlobalConsensus: 'Kusama',
					},
					{
						Parachain: '1000',
					},
				],
			},
		};

		const result = getGlobalConsensusDestFromLocation(locationStr);

		expect(result).toEqual(expected);
	});
	it('Should correctly retrieve the global consensus dest based on the location for Ethereum', () => {
		const locationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;

		const expected = {
			parents: '2',
			interior: {
				X1: {
					GlobalConsensus: {
						Ethereum: {
							chainId: '11155111',
						},
					},
				},
			},
		};

		const result = getGlobalConsensusDestFromLocation(locationStr);

		expect(result).toEqual(expected);
	});
	it('Should correctly throw an error when a location is provided that does not contain a GlobalConsensus destination junction value', () => {
		const locationStr = `{"parents":"1","interior":{"X1":{"Parachain":"2030"}}}`;

		const err = () => getGlobalConsensusDestFromLocation(locationStr);

		expect(err).toThrow(
			`Bridge transaction location {"parents":"1","interior":{"X1":{"Parachain":"2030"}}} must contain a valid GlobalConsensus Junction`,
		);
	});
	it('Should correctly throw an error when a location is provided that does not contain a valid GlobalConsensus at the 0 index', () => {
		const locationStr = `{"parents":"1","interior":{"X2":[{"Parachain":"2030"},{"GlobalConsensus":"Kusama"}]}}`;

		const err = () => getGlobalConsensusDestFromLocation(locationStr);

		expect(err).toThrow(
			`Bridge transaction location interior {"X2":[{"Parachain":"2030"},{"GlobalConsensus":"Kusama"}]} does not contain a GlobalConsensus Junction in the first index`,
		);
	});
});
