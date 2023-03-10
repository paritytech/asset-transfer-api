import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { SystemToPara } from './SystemToPara';

describe('XcmVersionedMultiLocation Generation', () => {
	describe('Beneficiary', () => {
		it('Should work for V0', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				mockSystemApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				0
			);

			const expectedRes = {
				v0: {
					x1: {
						accountId32: {
							id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							network: {
								any: null,
							},
						},
					},
				},
			};

			expect(beneficiary.toJSON()).toStrictEqual(expectedRes);
		});

		it('Should work for V1', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				mockSystemApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				1
			);

			const expectedRes = {
				v1: {
					parents: 0,
					interior: {
						x1: {
							accountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
								network: {
									any: null,
								},
							},
						},
					},
				},
			};

			expect(beneficiary.toJSON()).toStrictEqual(expectedRes);
		});
	});

	describe('Destination', () => {
		it('Should work for V0', () => {
			const destination = SystemToPara.createDest(mockSystemApi, '100', 0);

			const expectedRes = {
				v0: {
					x1: {
						parachain: 100,
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});

		it('Should work for V1', () => {
			const destination = SystemToPara.createDest(mockSystemApi, '100', 1);

			const expectedRes = {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 100,
						},
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
	});

	describe('Assets', () => {
		it('Should work for V0', () => {
			const assets = SystemToPara.createAssets(
				mockSystemApi,
				['100', '100'],
				0,
				['1', '2']
			);

			const expectedRes = {
				v0: [
					{
						concreteFungible: {
							amount: 100,
							id: {
								x2: [{ palletInstance: 50 }, { generalIndex: 1 }],
							},
						},
					},
					{
						concreteFungible: {
							amount: 100,
							id: {
								x2: [{ palletInstance: 50 }, { generalIndex: 2 }],
							},
						},
					},
				],
			};

			expect(assets.toJSON()).toEqual(expectedRes);
		});
		it('Should work for V1', () => {
			const assets = SystemToPara.createAssets(
				mockSystemApi,
				['100', '100'],
				1,
				['1', '2']
			);

			const expectedRes = {
				v1: [
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 1 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 2 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('WeightLimit', () => {
		// NOTE: for V0, V1, and V2 Weightlimit just uses V2 so we only need to test once.
		// No matter the version if its equal to or less than 2, it will alwyas default to V2. 
		it('Should work when given a weightLimit', () => {
			const weightLimit = SystemToPara.createWeightLimit(
				mockSystemApi,
				'100000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 100000000
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = SystemToPara.createWeightLimit(mockSystemApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null
			})
		});
	})
});
