// Copyright 2024 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { adjustedMockSystemApiV1011000 } from '../testHelpers/adjustedMockSystemApiV1011000';
import { SystemToBridge } from './SystemToBridge';

describe('SystemToBridge', () => {
	const registry = new Registry('asset-hub-rococo', {});
	const isForeignAssetsTransfer = true;
	const isLiquidTokenTransfer = false;
	describe('Beneficiary', () => {
		it('Should work for V3', () => {
			const beneficiary = SystemToBridge.createBeneficiary(
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
			const beneficiary = SystemToBridge.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

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
			const beneficiary = SystemToBridge.createBeneficiary(
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
		it('Should work for V4 for an Ethereum Address', () => {
			const beneficiary = SystemToBridge.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 4);

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
	});
	describe('Destination', () => {
		it('Should work for V3', () => {
			const destId = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;
			const destination = SystemToBridge.createDest(destId, 3);

			const expectedRes = {
				V3: {
					parents: 2,
					interior: {
						X1: {
							GlobalConsensus: {
								Ethereum: {
									chainId: '11155111',
								},
							},
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destId = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`;

			const destination = SystemToBridge.createDest(destId, 4);

			const expectedRes = {
				V4: {
					parents: 2,
					interior: {
						X1: [
							{
								GlobalConsensus: 'Kusama',
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		it('Should work for V3', async () => {
			const assets = await SystemToBridge.createAssets(
				['10000000000'],
				3,
				'asset-hub-westend',
				[`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Rococo"}}}`],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: adjustedMockSystemApiV1011000,
				},
			);

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								parents: '2',
								interior: {
									X1: { GlobalConsensus: 'Rococo' },
								},
							},
						},
						fun: {
							Fungible: '10000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await SystemToBridge.createAssets(
				['10000000000'],
				4,
				'asset-hub-westend',
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
				],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: adjustedMockSystemApiV1011000,
				},
			);

			const expectedRes = {
				V4: [
					{
						id: {
							parents: '2',
							interior: {
								X2: [
									{
										GlobalConsensus: {
											Ethereum: {
												chainId: '11155111',
											},
										},
									},
									{
										AccountKey20: {
											network: null,
											key: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
										},
									},
								],
							},
						},
						fun: {
							Fungible: '10000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
	});
});
