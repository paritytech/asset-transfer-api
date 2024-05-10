// Copyright 2024 Parity Technologies (UK) Ltd.

import { UnionXcmMultiLocation } from '../types';
import { createDefaultXcmOnDestination } from './createDefaultXcmOnDestination';

describe('createDefaultXcmOnDestination', () => {
	it('Should correctly construct the default XCM message for V3', () => {
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const beneficiary = {
			parents: 0,
			interior: {
				X1: { AccountId32: { id: accountId } },
			},
		} as UnionXcmMultiLocation;

		const xcmVersion = 3;

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

		expect(createDefaultXcmOnDestination(beneficiary, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the default XCM message for V4', () => {
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const beneficiary = {
			parents: 0,
			interior: {
				X1: { AccountId32: { id: accountId } },
			},
		} as UnionXcmMultiLocation;

		const xcmVersion = 4;

		const expected = {
			V4: [
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

		expect(createDefaultXcmOnDestination(beneficiary, xcmVersion)).toEqual(expected);
	});
});
