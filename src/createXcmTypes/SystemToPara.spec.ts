// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { SystemToPara } from './SystemToPara';
import { createSystemToParaMultiAssets } from './SystemToPara';

describe('SystemToPara XcmVersioned Generation', () => {
	const registry = new Registry('statemine', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = SystemToPara.createBeneficiary(
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
		it('Should work for V2 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 2);

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
			const beneficiary = SystemToPara.createBeneficiary(
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
		it('Should work for V3 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

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
			const beneficiary = SystemToPara.createBeneficiary(
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
		it('Should work for V5', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				5,
			);

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
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 4);

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
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 5);

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

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = SystemToPara.createDest('100', 2);

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
			const destination = SystemToPara.createDest('100', 3);

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
		it('Should work for V4', () => {
			const destination = SystemToPara.createDest('100', 4);

			const expectedRes = {
				V4: {
					parents: 1,
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
		it('Should work for V5', () => {
			const destination = SystemToPara.createDest('100', 5);

			const expectedRes = {
				V5: {
					parents: 1,
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
			const assets = await SystemToPara.createAssets(['100', '100'], 2, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V2: [
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '1' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '2' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 3, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '1' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '2' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 4, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V4: [
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '2' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V5', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 5, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V5: [
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '2' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should correctly construct a liquid token transfer for V3', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 3, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: true,
				api: mockSystemApi,
			});

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '55' }, { GeneralIndex: '1' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Concrete: {
								Parents: '0',
								Interior: {
									X2: [{ PalletInstance: '55' }, { GeneralIndex: '2' }],
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should correctly construct a liquid token transfer for V4', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 4, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: true,
				api: mockSystemApi,
			});

			const expectedRes = {
				V4: [
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '55' }, { GeneralIndex: '1' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '55' }, { GeneralIndex: '2' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should correctly construct a liquid token transfer for V5', async () => {
			const assets = await SystemToPara.createAssets(['100', '100'], 5, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: true,
				api: mockSystemApi,
			});

			const expectedRes = {
				V5: [
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '55' }, { GeneralIndex: '1' }],
							},
						},
						fun: {
							Fungible: '100',
						},
					},
					{
						id: {
							Parents: '0',
							Interior: {
								X2: [{ PalletInstance: '55' }, { GeneralIndex: '2' }],
							},
						},
						fun: {
							Fungible: '100',
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

			const weightLimit = SystemToPara.createWeightLimit({
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
			const weightLimit = SystemToPara.createWeightLimit({});

			expect(weightLimit).toStrictEqual({
				Unlimited: null,
			});
		});
	});

	describe('createSystemToParaMultiAssets', () => {
		it('Should correctly create system multi assets for SystemToPara xcm direction for V2', async () => {
			const expected = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Concrete: {
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
							},
							Parents: '0',
						},
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Concrete: {
							Interior: {
								Here: '',
							},
							Parents: '1',
						},
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = await createSystemToParaMultiAssets({
				api: mockSystemApi,
				amounts,
				specName,
				assets,
				registry,
				xcmVersion: 2,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create system multi assets for SystemToPara xcm direction for V3', async () => {
			const expected = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Concrete: {
							Interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
							},
							Parents: '0',
						},
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Concrete: {
							Interior: {
								Here: '',
							},
							Parents: '1',
						},
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = await createSystemToParaMultiAssets({
				api: mockSystemApi,
				amounts,
				specName,
				assets,
				registry,
				xcmVersion: 3,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create system multi assets for SystemToPara xcm direction for V4', async () => {
			const expected = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
						},
						Parents: '0',
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Interior: {
							Here: '',
						},
						Parents: '1',
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = await createSystemToParaMultiAssets({
				api: mockSystemApi,
				amounts,
				specName,
				assets,
				registry,
				xcmVersion: 4,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create system multi assets for SystemToPara xcm direction for V5', async () => {
			const expected = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
						},
						Parents: '0',
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Interior: {
							Here: '',
						},
						Parents: '1',
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = await createSystemToParaMultiAssets({
				api: mockSystemApi,
				amounts,
				specName,
				assets,
				registry,
				xcmVersion: 5,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(result).toStrictEqual(expected);
		});
	});
});
