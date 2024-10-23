// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry/index.js';
import { mockRelayApiV9420 } from '../testHelpers/mockRelayApiV9420.js';
import { RelayToPara } from './RelayToPara.js';

describe('RelayToPara XcmVersioned Generation', () => {
	const registry = new Registry('kusama', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = RelayToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2,
			);

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
		it('Should work for V2 Ethereum address', () => {
			const beneficiary = RelayToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 2);

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
			const beneficiary = RelayToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				3,
			);

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
		it('Should work for V3 Ethereum address', () => {
			const beneficiary = RelayToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

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
			const beneficiary = RelayToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				4,
			);

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
		it('Should work for V4 Ethereum address', () => {
			const beneficiary = RelayToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 4);

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
	});

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = RelayToPara.createDest('100', 2);

			const expectedRes = {
				V2: {
					parents: 0,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = RelayToPara.createDest('100', 3);

			const expectedRes = {
				V3: {
					parents: 0,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destination = RelayToPara.createDest('100', 4);

			const expectedRes = {
				V4: {
					parents: 0,
					interior: {
						X1: [
							{
								Parachain: '100',
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		const isForeignAssetsTransfer = false;
		const isLiquidTokenTransfer = false;

		it('Should work for V2', async () => {
			const assets = await RelayToPara.createAssets(['100'], 2, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V2: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await RelayToPara.createAssets(['100'], 3, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V3: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await RelayToPara.createAssets(['100'], 4, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V4: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 0,
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
	});
	describe('WeightLimit', () => {
		// NOTE: for V0, V1, and V2 Weightlimit just uses V2 so we only need to test once.
		// No matter the version if its equal to or less than 2, it will alwyas default to V2.
		it('Should work when weightLimit option is provided', () => {
			const refTime = '100000000';
			const proofSize = '1000';

			const weightLimit = RelayToPara.createWeightLimit({
				weightLimit: {
					refTime,
					proofSize,
				},
			});
			expect(weightLimit).toStrictEqual({
				Limited: {
					refTime: '100000000',
					proofSize: '1000',
				},
			});
		});
		it('Should work when weightLimit option is not provided', () => {
			const weightLimit = RelayToPara.createWeightLimit({});

			expect(weightLimit).toStrictEqual({
				Unlimited: null,
			});
		});
	});
});
