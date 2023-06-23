// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { SystemToSystem } from './SystemToSystem';

describe('SystemToSystem XcmVersioned Generation', () => {
	const registry = new Registry('statemine', {});

	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = SystemToSystem.createBeneficiary(
				mockSystemApi,
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
			const beneficiary = SystemToSystem.createBeneficiary(
				mockSystemApi,
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
			const destination = SystemToSystem.createDest(mockSystemApi, '1000', 2);

			const expectedRes = {
				v2: {
					parents: 1,
					interior: {
						x1: {
                            parachain: 1000
                        },
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = SystemToSystem.createDest(mockSystemApi, '1002', 3);

			const expectedRes = {
				v3: {
					parents: 1,
					interior: {
						x1: {
                            parachain: 1002,
                        }
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
	});

	describe('Assets', () => {
		it('Should work for V2', () => {
			const assets = SystemToSystem.createAssets(
				mockSystemApi,
				['100'],
				2,
				'statemine',
				['USDT'],
				{ registry }
			);

			const expectedRes = {
				v2: [
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 },{ generalIndex: 11 }]
								}
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
			const assets = SystemToSystem.createAssets(
				mockSystemApi,
				['100'],
				3,
				'bridge-hub-kusama',
				['ksm'],
				{ registry }
			);

			const expectedRes = {
				v3: [
					{
						id: {
							concrete: {
								parents: 1,
								interior: {
									here: null,
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
				],
			};

			console.log('ASSETS TO JSON', assets.toJSON());

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});

		it('Should error when system chain ID is not found for V3', () => {
			const expectedErrorMessage = 'bridge-hub-kusama has no associated token symbol usdc';

			const err = () => SystemToSystem.createAssets(
				mockSystemApi,
				['100'],
				3,
				'bridge-hub-kusama',
				['usdc'],
				{ registry }
			);



			expect(err).toThrowError(expectedErrorMessage);
		});
	});
	describe('WeightLimit', () => {
		it('Should work when given a weightLimit', () => {
			const weightLimit = SystemToSystem.createWeightLimit(
				mockSystemApi,
				'100000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 100000000,
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = SystemToSystem.createWeightLimit(mockSystemApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});
});
