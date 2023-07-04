// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockParachainApi } from '../testHelpers/mockParachainApi';
import { ParaToSystem } from './ParaToSystem';

describe('ParaToSystem', () => {
	const registry = new Registry('kusama', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			console.log(registry !== undefined);
			const beneficiary = ParaToSystem.createBeneficiary(
				mockParachainApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2
			);

			const expectedRes = {
				v2: {
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
		it('Should work for V3', () => {
			const beneficiary = ParaToSystem.createBeneficiary(
				mockParachainApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				3
			);

			const expectedRes = {
				v3: {
					parents: 0,
					interior: {
						x1: {
							accountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
								network: null,
							},
						},
					},
				},
			};

			expect(beneficiary.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = ParaToSystem.createDest(mockParachainApi, '100', 2);

			const expectedRes = {
				v2: {
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
		it('Should work for V3', () => {
			const destination = ParaToSystem.createDest(mockParachainApi, '100', 3);

			const expectedRes = {
				v3: {
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
		it('Should work for V2', () => {
			const assets = ParaToSystem.createAssets(
				mockParachainApi,
				['100', '200'],
				2,
				'moonriver',
				['1', '2'],
				{ registry }
			);

			const expectedRes = {
				v2: [
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
		it('Should work for V3', () => {
			const assets = ParaToSystem.createAssets(
				mockParachainApi,
				['100', '200'],
				3,
				'moonriver',
				['1', '2'],
				{ registry }
			);

			const expectedRes = {
				v3: [
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
		it('Should work when given a weightLimit', () => {
			const weightLimit = ParaToSystem.createWeightLimit(
				mockParachainApi,
				'1000000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 1000000000,
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = ParaToSystem.createWeightLimit(mockParachainApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});
});
