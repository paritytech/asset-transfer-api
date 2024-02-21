// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { adjustedMockMoonriverParachainApi } from '../testHelpers/adjustedMockMoonriverParachainApi';
import { ParaToRelay } from './ParaToRelay';

describe('ParaToRelay', () => {
	const registry = new Registry('Moonriver', {});
	const assetOpts = {
		registry,
		isLiquidTokenTransfer: false,
		isForeignAssetsTransfer: false,
		api: adjustedMockMoonriverParachainApi,
	};
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = ParaToRelay.createBeneficiary(
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
		it('Should work for V3', () => {
			const beneficiary = ParaToRelay.createBeneficiary(
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
		it('Should work for V4', () => {
			const beneficiary = ParaToRelay.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				4,
			);

			const expectedRes = {
				V4: {
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
	describe('Dest', () => {
		it('Should work for V2', () => {
			const dest = ParaToRelay.createDest('', 2);
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
			const dest = ParaToRelay.createDest('', 3);
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
			const dest = ParaToRelay.createDest('', 4);
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
	});
	describe('Assets', () => {
		it('Should work for V2', async () => {
			const asset = await ParaToRelay.createAssets(['1000000'], 2, 'Moonriver', ['ksm'], assetOpts);
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
			const asset = await ParaToRelay.createAssets(['1000000'], 3, 'Moonriver', ['ksm'], assetOpts);
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
			const asset = await ParaToRelay.createAssets(['1000000'], 4, 'Moonriver', ['ksm'], assetOpts);
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
	});
	describe('WeightLimit', () => {
		it('Should work for unLimited', () => {
			const weightLimit = ParaToRelay.createWeightLimit({ isLimited: true });
			const expected = {
				Unlimited: null,
			};
			expect(weightLimit).toStrictEqual(expected);
		});
		it('Should work for a weightLimit', () => {
			const weightLimit = ParaToRelay.createWeightLimit({
				isLimited: true,
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
			const feeAssetItem = await ParaToRelay.createFeeAssetItem(adjustedMockMoonriverParachainApi, opts);
			expect(feeAssetItem).toStrictEqual(0);
		});
	});
	describe('XTokensBeneficiaryDest', () => {
		it('Should work for V2', () => {
			if (ParaToRelay.createXTokensBeneficiary) {
				const xTokensBeneficiary = ParaToRelay.createXTokensBeneficiary(
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
			}
		});
		it('Should work for V3', () => {
			if (ParaToRelay.createXTokensBeneficiary) {
				const xTokensBeneficiary = ParaToRelay.createXTokensBeneficiary(
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
			}
		});
		it('Should work for V4', () => {
			if (ParaToRelay.createXTokensBeneficiary) {
				const xTokensBeneficiary = ParaToRelay.createXTokensBeneficiary(
					'',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					4,
				);
				const expected = {
					V4: {
						parents: 1,
						interior: {
							X1: { AccountId32: { id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b' } },
						},
					},
				};

				expect(xTokensBeneficiary).toStrictEqual(expected);
			}
		});
	});
	describe('XTokensAsset', () => {
		it('Should work for V2', async () => {
			if (ParaToRelay.createXTokensAsset) {
				const xTokensAsset = await ParaToRelay.createXTokensAsset('1000000', 2, 'Moonriver', 'KSM', assetOpts);
				const expected = {
					V2: {
						id: {
							Concrete: {
								parents: 1,
								interior: {
									Here: null,
								},
							},
						},
						fun: {
							Fungible: { Fungible: '1000000' },
						},
					},
				};
				expect(xTokensAsset).toStrictEqual(expected);
			}
		});
		it('Should work for V3', async () => {
			if (ParaToRelay.createXTokensAsset) {
				const xTokensAsset = await ParaToRelay.createXTokensAsset('1000000', 3, 'Moonriver', 'KSM', assetOpts);
				const expected = {
					V3: {
						id: {
							Concrete: {
								parents: 1,
								interior: {
									Here: null,
								},
							},
						},
						fun: {
							Fungible: { Fungible: '1000000' },
						},
					},
				};
				expect(xTokensAsset).toStrictEqual(expected);
			}
		});
		it('Should work for V4', async () => {
			if (ParaToRelay.createXTokensAsset) {
				const xTokensAsset = await ParaToRelay.createXTokensAsset('1000000', 4, 'Moonriver', 'KSM', assetOpts);
				const expected = {
					V4: {
						id: {
							parents: 1,
							interior: {
								Here: null,
							},
						},
						fun: {
							Fungible: { Fungible: '1000000' },
						},
					},
				};
				expect(xTokensAsset).toStrictEqual(expected);
			}
		});
	});
});
