import { Registry } from '../../registry';
import { adjustedMockSystemApiV1016000 } from '../../testHelpers/adjustedMockSystemApiV1016000';
import { RelayToBridge } from './RelayToBridge';

describe('RelayToBridge', () => {
	const v3Handler = new RelayToBridge(3);
	const v4Handler = new RelayToBridge(4);
	const v5Handler = new RelayToBridge(5);
	const registry = new Registry('paseo', {});
	const isForeignAssetsTransfer = true;
	const isLiquidTokenTransfer = false;

	describe('Destination', () => {
		it('Should work for V3', () => {
			const destId = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;
			const destination = v3Handler.createDest(destId, 3);

			const expectedRes = {
				V3: {
					parents: 1,
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
			const destId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}`;

			const destination = v4Handler.createDest(destId, 4);

			const expectedRes = {
				V4: {
					parents: 1,
					interior: {
						X2: [
							{
								GlobalConsensus: 'Kusama',
							},
							{
								Parachain: '1000',
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V5', () => {
			const destId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}`;

			const destination = v5Handler.createDest(destId, 5);

			const expectedRes = {
				V5: {
					parents: 1,
					interior: {
						X2: [
							{
								GlobalConsensus: 'Kusama',
							},
							{
								Parachain: '1000',
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
			const assets = await v3Handler.createAssets(
				['10000000000'],
				3,
				'paseo',
				[`{"parents":"0","interior":{"Here":""}}`],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: adjustedMockSystemApiV1016000,
				},
			);

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									Here: '',
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
			const assets = await v4Handler.createAssets(
				['10000000000'],
				4,
				'paseo',
				[`{"parents":"0","interior":{"Here":""}}`],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: adjustedMockSystemApiV1016000,
				},
			);

			const expectedRes = {
				V4: [
					{
						id: {
							parents: 0,
							interior: {
								Here: '',
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
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(
				['10000000000'],
				5,
				'paseo',
				[`{"parents":"0","interior":{"Here":""}}`],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: adjustedMockSystemApiV1016000,
				},
			);

			const expectedRes = {
				V5: [
					{
						id: {
							parents: 0,
							interior: {
								Here: '',
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
