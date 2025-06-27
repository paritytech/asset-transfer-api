import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { SystemToSystem } from './SystemToSystem';

describe('SystemToSystem XcmVersioned Generation', () => {
	const v2Handler = new SystemToSystem(2);
	const v3Handler = new SystemToSystem(3);
	const v4Handler = new SystemToSystem(4);
	const v5Handler = new SystemToSystem(5);
	const registry = new Registry('statemine', {});

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = v2Handler.createDest('1000');

			const expectedRes = {
				V2: {
					parents: 1,
					interior: {
						X1: {
							Parachain: '1000',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = v3Handler.createDest('1002');

			const expectedRes = {
				V3: {
					parents: 1,
					interior: {
						X1: {
							Parachain: '1002',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destination = v4Handler.createDest('1002');

			const expectedRes = {
				V4: {
					parents: 1,
					interior: {
						X1: [
							{
								Parachain: '1002',
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V5', () => {
			const destination = v5Handler.createDest('1002');

			const expectedRes = {
				V5: {
					parents: 1,
					interior: {
						X1: [
							{
								Parachain: '1002',
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
			const assets = await v2Handler.createAssets(['100'], 'statemine', ['USDT'], {
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
								parents: '0',
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
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
			const assets = await v3Handler.createAssets(['100'], 'bridge-hub-kusama', ['ksm'], {
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
								parents: '1',
								interior: {
									Here: '',
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
			const assets = await v4Handler.createAssets(['100'], 'bridge-hub-kusama', ['ksm'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V4: [
					{
						id: {
							parents: '1',
							interior: {
								Here: '',
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
			const assets = await v5Handler.createAssets(['100'], 'bridge-hub-kusama', ['ksm'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V5: [
					{
						id: {
							parents: '1',
							interior: {
								Here: '',
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

		it('Should error when asset ID is not found for V3', async () => {
			const expectedErrorMessage = 'bridge-hub-kusama has no associated token symbol usdc';

			await expect(async () => {
				await v3Handler.createAssets(['100'], 'bridge-hub-kusama', ['usdc'], {
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: mockSystemApi,
				});
			}).rejects.toThrow(expectedErrorMessage);
		});
		it('Should work for a liquid token transfer', async () => {
			const assets = await v2Handler.createAssets(['100'], 'statemine', ['USDT'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: true,
				api: mockSystemApi,
			});

			const expectedRes = {
				V2: [
					{
						id: {
							Concrete: {
								parents: '0',
								interior: {
									X2: [{ PalletInstance: '55' }, { GeneralIndex: '11' }],
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
	});
	describe('WeightLimit', () => {
		it('Should work when weightLimit option is provided', () => {
			const refTime = '100000000';
			const proofSize = '1000';

			const weightLimit = v5Handler.createWeightLimit({
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
			const weightLimit = v5Handler.createWeightLimit({});

			expect(weightLimit).toStrictEqual({
				Unlimited: null,
			});
		});
	});
});
