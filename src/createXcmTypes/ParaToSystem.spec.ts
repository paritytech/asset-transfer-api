// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockParachainApi } from '../testHelpers/mockParachainApi';
import { ParaToSystem } from './ParaToSystem';

describe('ParaToSystem', () => {
	const registry = new Registry('kusama', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = ParaToSystem.createBeneficiary(
				mockParachainApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2
			);

			const expectedRes = {
				v2: {
					parents: 0,
					interior: mockParachainApi.registry.createType(
						'InteriorMultiLocation',
						{
							X1: {
								AccountId32: {
									id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
									network: {
										any: null,
									},
								},
							},
						}
					),
				},
			};

			expect(beneficiary.toJSON()?.toString()).toStrictEqual(
				expectedRes.toString()
			);
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
					interior: mockParachainApi.registry.createType(
						'InteriorMultiLocation',
						{
							X1: {
								AccountId32: {
									id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
									network: null,
								},
							},
						}
					),
				},
			};

			expect(beneficiary.toJSON()?.toString()).toStrictEqual(
				expectedRes.toString()
			);
		});
	});
	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = ParaToSystem.createDest(mockParachainApi, '100', 2);

			const expectedRes = {
				v2: {
					parents: 1,
					interior: mockParachainApi.registry.createType(
						'InteriorMultiLocation',
						{
							X1: {
								Parachain: 100,
							},
						}
					),
				},
			};

			expect(destination.toJSON()?.toString()).toStrictEqual(
				expectedRes.toString()
			);
		});
		it('Should work for V3', () => {
			const destination = ParaToSystem.createDest(mockParachainApi, '100', 3);

			const expectedRes = {
				v3: {
					parents: 1,
					interior: mockParachainApi.registry.createType(
						'InteriorMultiLocation',
						{
							X1: {
								Parachain: 100,
							},
						}
					),
				},
			};

			expect(destination.toJSON()?.toString()).toStrictEqual(
				expectedRes.toString()
			);
		});
	});
	describe('Assets', () => {
		it('Should work for V2', async () => {
			const isForeignAssetsTransfer = false;
			const assets = await ParaToSystem.createAssets(
				mockParachainApi,
				['100', '200'],
				2,
				'moonriver',
				['1', '2'],
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
								parents: 0,
								interior: mockParachainApi.registry.createType(
									'InteriorMultiLocation',
									{
										X2: [{ PalletInstance: 50 }, { GeneralIndex: 1 }],
									}
								),
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
								interior: mockParachainApi.registry.createType(
									'InteriorMultiLocation',
									{
										X2: [{ PalletInstance: 50 }, { GeneralIndex: 2 }],
									}
								),
							},
						},
						fun: {
							fungible: 200,
						},
					},
				],
			};

			expect(assets.toJSON()?.toString()).toStrictEqual(expectedRes.toString());
		});
		it('Should work for V3', async () => {
			const isForeignAssetsTransfer = false;
			const assets = await ParaToSystem.createAssets(
				mockParachainApi,
				['100', '200'],
				3,
				'moonriver',
				['1', '2'],
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
								parents: 0,
								interior: mockParachainApi.registry.createType(
									'InteriorMultiLocation',
									{
										X2: [{ PalletInstance: 50 }, { GeneralIndex: 1 }],
									}
								),
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
								interior: mockParachainApi.registry.createType(
									'InteriorMultiLocation',
									{
										X2: [{ PalletInstance: 50 }, { GeneralIndex: 2 }],
									}
								),
							},
						},
						fun: {
							fungible: 200,
						},
					},
				],
			};

			expect(assets.toJSON()?.toString()).toStrictEqual(expectedRes.toString());
		});
	});
	describe('WeightLimit', () => {
		it('Should work when isLimited is true testing', () => {
			const isLimited = true;
			const refTime = '100000000';
			const proofSize = '1000';

			const weightLimit = ParaToSystem.createWeightLimit(mockParachainApi, {
				isLimited,
				refTime,
				proofSize,
			});
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: {
					proofSize: 1000,
					refTime: 100000000,
				},
			});
		});
		it('Should work when isLimited is falsy', () => {
			const weightLimit = ParaToSystem.createWeightLimit(mockParachainApi, {});

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});
});
