// Copyright 2024 Parity Technologies (UK) Ltd.

import { createBeneficiary } from './createBeneficiary';

describe('createBeneficiary', () => {
	it('Should work for V2', () => {
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', 2);

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
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 2);

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
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', 3);

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
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

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
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', 4);

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
		const beneficiary = createBeneficiary('0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', 5);

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
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 4);

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
		const beneficiary = createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 5);

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
