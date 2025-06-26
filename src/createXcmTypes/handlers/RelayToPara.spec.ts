import { Registry } from '../../registry';
import { mockRelayApiV9420 } from '../../testHelpers/mockRelayApiV9420';
import { RelayToPara } from './RelayToPara';

describe('RelayToPara XcmVersioned Generation', () => {
	const v2Handler = new RelayToPara(2);
	const v3Handler = new RelayToPara(3);
	const v4Handler = new RelayToPara(4);
	const v5Handler = new RelayToPara(5);
	const registry = new Registry('kusama', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = v2Handler.createBeneficiary(
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
		it('Should work for V2 Ethereum address', () => {
			const beneficiary = v2Handler.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 2);

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
			const beneficiary = v3Handler.createBeneficiary(
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
		it('Should work for V3 Ethereum address', () => {
			const beneficiary = v3Handler.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

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
			const beneficiary = v4Handler.createBeneficiary(
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
			const beneficiary = v5Handler.createBeneficiary(
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
		it('Should work for V4 Ethereum address', () => {
			const beneficiary = v4Handler.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 4);

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
		it('Should work for V5 Ethereum address', () => {
			const beneficiary = v5Handler.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 5);

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
			const destination = v2Handler.createDest('100', 2);

			const expectedRes = {
				V2: {
					parents: 0,
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
			const destination = v3Handler.createDest('100', 3);

			const expectedRes = {
				V3: {
					parents: 0,
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
			const destination = v4Handler.createDest('100', 4);

			const expectedRes = {
				V4: {
					parents: 0,
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
			const destination = v5Handler.createDest('100', 5);

			const expectedRes = {
				V5: {
					parents: 0,
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
			const assets = await v2Handler.createAssets(['100'], 2, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V2: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await v3Handler.createAssets(['100'], 3, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V3: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await v4Handler.createAssets(['100'], 4, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V4: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 0,
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(['100'], 5, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V5: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 0,
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
