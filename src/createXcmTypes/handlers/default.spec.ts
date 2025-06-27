// createBeneficiary
// createWeightLimit
// createXTokensAssets
// createXTokensFeeAssetItem

import { DefaultHandler } from './default';

describe('DefaultHandler', () => {
	describe('createBeneficiary', () => {
		const address = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';
		const v2ExpectedAccount = {
			AccountId32: {
				id: address,
				network: 'Any',
			},
		};
		const v3ExpectedAccount = {
			AccountId32: {
				id: address,
			},
		};
		const v4ExpectedAccount = [
			{
				AccountId32: {
					id: address,
				},
			},
		];
		test.each([
			[2, v2ExpectedAccount],
			[3, v3ExpectedAccount],
			[4, v4ExpectedAccount],
			[5, v4ExpectedAccount],
		])('V%i', (xcmVersion, expectedAccount) => {
			const handler = new DefaultHandler(xcmVersion);
			const beneficiary = handler.createBeneficiary(address);
			const expected = {
				[`V${xcmVersion}`]: {
					parents: 0,
					interior: {
						X1: expectedAccount,
					},
				},
			};
			expect(beneficiary).toStrictEqual(expected);
		});
	});
});
