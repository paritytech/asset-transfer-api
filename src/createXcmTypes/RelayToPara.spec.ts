import { mockApi } from '../testHelpers/mockApi';
import { RelayToPara } from './RelayToPara';

describe('XcmVersionedMultiLocation Generation', () => {
	describe('Beneficiary', () => {
		it('Should work for V0', () => {
			const beneficiary = RelayToPara.createBeneficiary(
				mockApi,
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
			const beneficiary = RelayToPara.createBeneficiary(
				mockApi,
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
			const destination = RelayToPara.createDest(mockApi, '100', 0);

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
			const destination = RelayToPara.createDest(mockApi, '100', 1);

			const expectedRes = {
				v1: {
					parents: 0,
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
});
