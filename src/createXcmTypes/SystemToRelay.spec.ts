// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { SystemToRelay } from './SystemToRelay';

describe('SystemToRelay XcmVersioned Generation', () => {
	const registry = new Registry('statemine', {});

	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = SystemToRelay.createBeneficiary(
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
			const beneficiary = SystemToRelay.createBeneficiary(
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
			const destination = SystemToRelay.createDest(mockSystemApi, '0', 2);

			const expectedRes = {
				v2: {
					parents: 1,
					interior: {
						here: null,
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = SystemToRelay.createDest(mockSystemApi, '0', 3);

			const expectedRes = {
				v3: {
					parents: 1,
					interior: {
						here: null,
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		const isForeignAssetsTransfer = false;

		it('Should work for V2', async () => {
			const assets = await SystemToRelay.createAssets(
				mockSystemApi,
				['100'],
				2,
				'',
				[],
				{
					registry,
					isForeignAssetsTransfer,
				}
			);

			const expectedRes = {
				v2: [
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

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await SystemToRelay.createAssets(
				mockSystemApi,
				['100'],
				3,
				'',
				[],
				{
					registry,
					isForeignAssetsTransfer,
				}
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

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('WeightLimit', () => {
		it('Should work when given a weightLimit', () => {
			const weightLimit = SystemToRelay.createWeightLimit(
				mockSystemApi,
				'100000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 100000000,
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = SystemToRelay.createWeightLimit(mockSystemApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});
});
