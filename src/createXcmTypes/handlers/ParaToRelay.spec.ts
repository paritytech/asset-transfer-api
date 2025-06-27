import { Registry } from '../../registry';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi';
import { ParaToRelay } from './ParaToRelay';

describe('ParaToRelay', () => {
	const v2Handler = new ParaToRelay(2);
	const v3Handler = new ParaToRelay(3);
	const v4Handler = new ParaToRelay(4);
	const v5Handler = new ParaToRelay(5);
	const registry = new Registry('Moonriver', {});
	const assetOpts = {
		registry,
		isLiquidTokenTransfer: false,
		isForeignAssetsTransfer: false,
		api: adjustedMockMoonriverParachainApi,
	};

	describe('Dest', () => {
		it('Should work for V2', () => {
			const dest = v2Handler.createDest('', 2);
			const expected = {
				V2: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
			expect(dest).toStrictEqual(expected);
		});
		it('Should work for V3', () => {
			const dest = v3Handler.createDest('', 3);
			const expected = {
				V3: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
			expect(dest).toStrictEqual(expected);
		});
		it('Should work for V4', () => {
			const dest = v4Handler.createDest('', 4);
			const expected = {
				V4: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
			expect(dest).toStrictEqual(expected);
		});
		it('Should work for V5', () => {
			const dest = v5Handler.createDest('', 5);
			const expected = {
				V5: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};
			expect(dest).toStrictEqual(expected);
		});
	});
	describe('Assets', () => {
		it('Should work for V2', async () => {
			const asset = await v2Handler.createAssets(['1000000'], 2, 'Moonriver', ['ksm'], assetOpts);
			const expected = {
				V2: [
					{
						fun: {
							Fungible: '1000000',
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
				],
			};
			expect(asset).toStrictEqual(expected);
		});
		it('Should work for V3', async () => {
			const asset = await v3Handler.createAssets(['1000000'], 3, 'Moonriver', ['ksm'], assetOpts);
			const expected = {
				V3: [
					{
						fun: {
							Fungible: '1000000',
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
				],
			};
			expect(asset).toStrictEqual(expected);
		});
		it('Should work for V4', async () => {
			const asset = await v4Handler.createAssets(['1000000'], 4, 'Moonriver', ['ksm'], assetOpts);
			const expected = {
				V4: [
					{
						fun: {
							Fungible: '1000000',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 1,
						},
					},
				],
			};
			expect(asset).toStrictEqual(expected);
		});
		it('Should work for V5', async () => {
			const asset = await v5Handler.createAssets(['1000000'], 5, 'Moonriver', ['ksm'], assetOpts);
			const expected = {
				V5: [
					{
						fun: {
							Fungible: '1000000',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 1,
						},
					},
				],
			};
			expect(asset).toStrictEqual(expected);
		});
	});
	describe('WeightLimit', () => {
		it('Should work for unlimited', () => {
			const weightLimit = v5Handler.createWeightLimit({});
			const expected = {
				Unlimited: null,
			};
			expect(weightLimit).toStrictEqual(expected);
		});
		it('Should work for a custom weightLimit', () => {
			const weightLimit = v5Handler.createWeightLimit({
				weightLimit: {
					refTime: '100000000',
					proofSize: '10000',
				},
			});
			const expected = {
				Limited: {
					refTime: '100000000',
					proofSize: '10000',
				},
			};
			expect(weightLimit).toStrictEqual(expected);
		});
	});
	describe('FeeAssetItem', () => {
		const opts = {
			registry,
			isLiquidTokenTransfer: false,
			isForeignAssetsTransfer: false,
		};
		it('Should return zero', async () => {
			const feeAssetItem = await v5Handler.createFeeAssetItem(adjustedMockMoonriverParachainApi, opts);
			expect(feeAssetItem).toStrictEqual(0);
		});
	});
	describe('XTokensBeneficiaryDest', () => {
		it('Should work for V2', () => {
			const xTokensBeneficiary = v2Handler.createXTokensBeneficiary(
				'',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2,
			);
			const expected = {
				V2: {
					parents: 1,
					interior: {
						X1: { AccountId32: { id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b' } },
					},
				},
			};

			expect(xTokensBeneficiary).toStrictEqual(expected);
		});
		it('Should work for V3', () => {
			const xTokensBeneficiary = v3Handler.createXTokensBeneficiary(
				'',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				3,
			);
			const expected = {
				V3: {
					parents: 1,
					interior: {
						X1: { AccountId32: { id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b' } },
					},
				},
			};

			expect(xTokensBeneficiary).toStrictEqual(expected);
		});
		it('Should work for V4', () => {
			const xTokensBeneficiary = v4Handler.createXTokensBeneficiary(
				'',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				4,
			);
			const expected = {
				V4: {
					parents: 1,
					interior: {
						X1: [{ AccountId32: { id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b' } }],
					},
				},
			};

			expect(xTokensBeneficiary).toStrictEqual(expected);
		});
		it('Should work for V5', () => {
			const xTokensBeneficiary = v5Handler.createXTokensBeneficiary(
				'',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				5,
			);
			const expected = {
				V5: {
					parents: 1,
					interior: {
						X1: [{ AccountId32: { id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b' } }],
					},
				},
			};

			expect(xTokensBeneficiary).toStrictEqual(expected);
		});
	});
	describe('XTokensAsset', () => {
		it('Should work for V2', async () => {
			const xTokensAsset = await v2Handler.createXTokensAsset('1000000', 2, 'Moonriver', 'KSM', assetOpts);
			const expected = {
				V2: {
					id: {
						Concrete: {
							parents: '1',
							interior: {
								Here: null,
							},
						},
					},
					fun: {
						Fungible: '1000000',
					},
				},
			};
			expect(xTokensAsset).toStrictEqual(expected);
		});
		it('Should work for V3', async () => {
			const xTokensAsset = await v3Handler.createXTokensAsset('1000000', 3, 'Moonriver', 'KSM', assetOpts);
			const expected = {
				V3: {
					id: {
						Concrete: {
							parents: '1',
							interior: {
								Here: null,
							},
						},
					},
					fun: {
						Fungible: '1000000',
					},
				},
			};
			expect(xTokensAsset).toStrictEqual(expected);
		});
		it('Should work for V4', async () => {
			const xTokensAsset = await v4Handler.createXTokensAsset('1000000', 4, 'Moonriver', 'KSM', assetOpts);
			const expected = {
				V4: {
					id: {
						parents: '1',
						interior: {
							Here: null,
						},
					},
					fun: {
						Fungible: '1000000',
					},
				},
			};
			expect(xTokensAsset).toStrictEqual(expected);
		});
		it('Should work for V5', async () => {
			const xTokensAsset = await v5Handler.createXTokensAsset('1000000', 5, 'Moonriver', 'KSM', assetOpts);
			const expected = {
				V5: {
					id: {
						parents: '1',
						interior: {
							Here: null,
						},
					},
					fun: {
						Fungible: '1000000',
					},
				},
			};
			expect(xTokensAsset).toStrictEqual(expected);
		});
	});
});
