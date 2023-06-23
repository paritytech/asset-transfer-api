// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { MultiAsset } from '../types';
import { SystemToPara } from './SystemToPara';
import { createSystemToParaMultiAssets } from './SystemToPara';

describe('SystemToPara XcmVersioned Generation', () => {
	const registry = new Registry('statemine', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = SystemToPara.createBeneficiary(
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
		it('Should work for V2 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				mockSystemApi,
				'0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
				2
			);

			const expectedRes = {
				v2: {
					parents: 0,
					interior: {
						x1: {
							accountKey20: {
								key: '0x96bd611ebe3af39544104e26764f4939924f6ece',
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
			const beneficiary = SystemToPara.createBeneficiary(
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
		it('Should work for V3 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				mockSystemApi,
				'0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
				3
			);

			const expectedRes = {
				v3: {
					parents: 0,
					interior: {
						x1: {
							accountKey20: {
								key: '0x96bd611ebe3af39544104e26764f4939924f6ece',
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
			const destination = SystemToPara.createDest(mockSystemApi, '100', 2);

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
			const destination = SystemToPara.createDest(mockSystemApi, '100', 3);

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
			const assets = SystemToPara.createAssets(
				mockSystemApi,
				['100', '100'],
				2,
				'statemint',
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
			const assets = SystemToPara.createAssets(
				mockSystemApi,
				['100', '100'],
				3,
				'statemint',
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
		// NOTE: for V0, V1, and V2 Weightlimit just uses V2 so we only need to test once.
		// No matter the version if its equal to or less than 2, it will alwyas default to V2.
		it('Should work when given a weightLimit', () => {
			const weightLimit = SystemToPara.createWeightLimit(
				mockSystemApi,
				'100000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 100000000,
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = SystemToPara.createWeightLimit(mockSystemApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});

	describe('createSystemToParaMultiAssets', () => {
		it('Should correctly create system multi assets for SystemToPara xcm direction', () => {
			const expected: MultiAsset[] = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Concrete: {
							interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
							},
							parents: 0,
						},
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Concrete: {
							interior: {
								Here: '',
							},
							parents: 1,
						},
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = createSystemToParaMultiAssets(
				mockSystemApi,
				amounts,
				specName,
				assets,
				registry
			);

			expect(result).toEqual(expected);
		});
	});
});
