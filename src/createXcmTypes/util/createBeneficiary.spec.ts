import { V2, V3, V4, V5 } from '../xcm/index.js';
import { createBeneficiary } from './createBeneficiary';

describe('createBeneficiary', () => {
	it('Should work for V2', () => {
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', V2);

		const expectedRes = {
			V2: {
				parents: 0,
				interior: {
					X1: {
						AccountId32: {
							id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							network: 'Any',
						},
					},
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V2 for an Ethereum Address', () => {
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', V2);

		const expectedRes = {
			V2: {
				parents: 0,
				interior: {
					X1: {
						AccountKey20: {
							key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
							network: 'Any',
						},
					},
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V3', () => {
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', V3);

		const expectedRes = {
			V3: {
				parents: 0,
				interior: {
					X1: {
						AccountId32: {
							id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						},
					},
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V3 for an Ethereum Address', () => {
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', V3);

		const expectedRes = {
			V3: {
				parents: 0,
				interior: {
					X1: {
						AccountKey20: {
							key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
						},
					},
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V4', () => {
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', V4);

		const expectedRes = {
			V4: {
				parents: 0,
				interior: {
					X1: [
						{
							AccountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							},
						},
					],
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V5', () => {
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', V5);

		const expectedRes = {
			V5: {
				parents: 0,
				interior: {
					X1: [
						{
							AccountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							},
						},
					],
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V4 for an Ethereum Address', () => {
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', V4);

		const expectedRes = {
			V4: {
				parents: 0,
				interior: {
					X1: [
						{
							AccountKey20: {
								key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
							},
						},
					],
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
	it('Should work for V5 for an Ethereum Address', () => {
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', V5);

		const expectedRes = {
			V5: {
				parents: 0,
				interior: {
					X1: [
						{
							AccountKey20: {
								key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
							},
						},
					],
				},
			},
		};

		expect(beneficiary).toStrictEqual(expectedRes);
	});
});
