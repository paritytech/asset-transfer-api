import { XcmMultiLocation } from '../types';
import { getXcmCreator } from '../xcm';
import { createXcmOnDestination } from './createXcmOnDestination';

describe('createXcmOnDestination', () => {
	it('Should correctly construct the default XCM message for V3', () => {
		const assetIds = [
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
		];
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const beneficiary = {
			parents: 0,
			interior: {
				X1: { AccountId32: { id: accountId } },
			},
		} as XcmMultiLocation;

		const xcmVersion = 3;
		const xcmCreator = getXcmCreator(xcmVersion);

		const expected = {
			V3: [
				{
					depositAsset: {
						assets: {
							Wild: {
								AllCounted: 1,
							},
						},
						beneficiary,
					},
				},
			],
		};

		expect(
			createXcmOnDestination({
				assets: assetIds,
				beneficiary,
				xcmCreator,
			}),
		).toEqual(expected);
	});
	it('Should correctly construct the default XCM message for V4', () => {
		const assetIds = [
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xc3d088842dcf02c13699f936bb83dfbbc6f721ab"}}]}}`,
		];
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const beneficiary = {
			parents: 0,
			interior: {
				X1: { AccountId32: { id: accountId } },
			},
		} as XcmMultiLocation;

		const xcmVersion = 4;
		const xcmCreator = getXcmCreator(xcmVersion);

		const expected = {
			V4: [
				{
					depositAsset: {
						assets: {
							Wild: {
								AllCounted: 2,
							},
						},
						beneficiary,
					},
				},
			],
		};

		expect(
			createXcmOnDestination({
				assets: assetIds,
				beneficiary,
				xcmCreator,
			}),
		).toEqual(expected);
	});
	it('Should correctly construct the default XCM message for V5', () => {
		const assetIds = [
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xc3d088842dcf02c13699f936bb83dfbbc6f721ab"}}]}}`,
		];
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const beneficiary = {
			parents: 0,
			interior: {
				X1: { AccountId32: { id: accountId } },
			},
		} as XcmMultiLocation;

		const xcmVersion = 5;
		const xcmCreator = getXcmCreator(xcmVersion);

		const expected = {
			V5: [
				{
					depositAsset: {
						assets: {
							Wild: {
								AllCounted: 2,
							},
						},
						beneficiary,
					},
				},
			],
		};

		expect(
			createXcmOnDestination({
				assets: assetIds,
				beneficiary,
				xcmCreator,
			}),
		).toEqual(expected);
	});
});
