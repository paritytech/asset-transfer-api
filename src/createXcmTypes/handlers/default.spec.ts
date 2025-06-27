// TODO:
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

	describe('createWeightLimit', () => {
		const refTime = '100000000';
		const proofSize = '1000';
		const expected = {
			Limited: {
				proofSize: '1000',
				refTime: '100000000',
			},
		};
		test.each([2, 3, 4, 5])('V%i should work when weight limit is provided', (xcmVersion) => {
			const handler = new DefaultHandler(xcmVersion);
			const weightLimit = handler.createWeightLimit({
				weightLimit: {
					refTime,
					proofSize,
				},
			});
			expect(weightLimit).toStrictEqual(expected);
		});
		test.each([2, 3, 4, 5])('V%i should work when weight limit is provided', (xcmVersion) => {
			const handler = new DefaultHandler(xcmVersion);
			const weightLimit = handler.createWeightLimit({});
			expect(weightLimit).toStrictEqual({ Unlimited: null });
		});
	});

	describe.skip('createXTokensAssets', () => {});

	describe.skip('createXTokensFeeAssetItem', () => {});
});
