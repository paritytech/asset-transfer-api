// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockParachainApi } from '../testHelpers/mockParachainApi';
import { ParaToSystem } from './ParaToSystem';

describe('ParaToSystem', () => {
	const registry = new Registry('kusama', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = ParaToSystem.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2
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
		it('Should work for V3', () => {
			const beneficiary = ParaToSystem.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				3
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
	});
	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = ParaToSystem.createDest('100', 2);

			const expectedRes = {
				V2: {
					parents: 1,
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
			const destination = ParaToSystem.createDest('100', 3);

			const expectedRes = {
				V3: {
					parents: 1,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		const isLiquidTokenTransfer = false;
		const isForeignAssetsTransfer = false;
		it('Should work for V2', async () => {
			const assets = await ParaToSystem.createAssets(
				mockParachainApi,
				['1000000000000', '2000000000'],
				2,
				'moonriver',
				['42259045809535163221576417993425387648', '182365888117048807484804376330534607370'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
				}
			);

			const expectedRes = {
				v2: [
					{
						id: {
							concrete: {
								parents: 1,
								interior: mockParachainApi.registry.createType('InteriorMultiLocation', {
									Here: null,
								}),
							},
						},
						fun: {
							fungible: 1000000000000,
						},
					},
					{
						id: {
							concrete: {
								parents: 1,
								interior: mockParachainApi.registry.createType('InteriorMultiLocation', {
									X3: [{ Parachain: 1000 }, { PalletInstance: 50 }, { GeneralIndex: 8 }],
								}),
							},
						},
						fun: {
							fungible: 2000000000,
						},
					},
				],
			};

			expect(assets.toString()).toEqual(JSON.stringify(expectedRes));
		});
		it('Should work for V3', async () => {
			const assets = await ParaToSystem.createAssets(
				mockParachainApi,
				['1000000', '20000000000'],
				3,
				'moonriver',
				['182365888117048807484804376330534607370', '311091173110107856861649819128533077277'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
				}
			);

			const expectedRes = {
				v3: [
					{
						id: {
							concrete: {
								parents: 1,
								interior: mockParachainApi.registry.createType('InteriorMultiLocation', {
									X3: [{ Parachain: 1000 }, { PalletInstance: 50 }, { GeneralIndex: 8 }],
								}),
							},
						},
						fun: {
							fungible: 1000000,
						},
					},
					{
						id: {
							concrete: {
								parents: 1,
								interior: mockParachainApi.registry.createType('InteriorMultiLocation', {
									X3: [{ Parachain: 1000 }, { PalletInstance: 50 }, { GeneralIndex: 1984 }],
								}),
							},
						},
						fun: {
							fungible: 20000000000,
						},
					},
				],
			};

			expect(assets.toString()).toEqual(JSON.stringify(expectedRes));
		});
	});
	describe('WeightLimit', () => {
		it('Should work when isLimited is true', () => {
			const isLimited = true;
			const refTime = '100000000';
			const proofSize = '1000';

			const weightLimit = ParaToSystem.createWeightLimit(mockParachainApi, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
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
