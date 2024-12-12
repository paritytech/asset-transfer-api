// Copyright 2024 Parity Technologies (UK) Ltd.

import { createXcmVersionedAssetId } from './createXcmVersionedAssetId';

describe('createXcmVersionedAssetId', () => {
	it('Should correctly construct an XcmVersionedAssetId for XCM V3', () => {
		const xcmVersion = 3;
		const destFeesAssetId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`;

		const expected = {
			V3: {
				Concrete: {
					parents: '2',
					interior: {
						X2: [
							{
								GlobalConsensus: {
									Ethereum: {
										chainId: '11155111',
									},
								},
							},
							{
								AccountKey20: {
									network: null,
									key: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
								},
							},
						],
					},
				},
			},
		};

		expect(createXcmVersionedAssetId(destFeesAssetId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct an XcmVersionedAssetId for XCM V4', () => {
		const xcmVersion = 4;
		const destFeesAssetId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`;

		const expected = {
			V4: {
				parents: '2',
				interior: {
					X2: [
						{
							GlobalConsensus: {
								Ethereum: {
									chainId: '11155111',
								},
							},
						},
						{
							AccountKey20: {
								network: null,
								key: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
							},
						},
					],
				},
			},
		};

		expect(createXcmVersionedAssetId(destFeesAssetId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly error when given an XCM version less than 3', () => {
		const xcmVersion = 2;
		const destFeesAssetId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`;

		const err = () => createXcmVersionedAssetId(destFeesAssetId, xcmVersion);

		expect(err).toThrow('XcmVersion must be greater than 2');
	});
});
