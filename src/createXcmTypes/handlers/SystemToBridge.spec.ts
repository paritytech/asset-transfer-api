import { Registry } from '../../registry';
import { adjustedMockSystemApiV1016000 } from '../../testHelpers/adjustedMockSystemApiV1016000';
import { SystemToBridge } from './SystemToBridge';

describe('SystemToBridge', () => {
	const v3Handler = new SystemToBridge(3);
	const v4Handler = new SystemToBridge(4);
	const v5Handler = new SystemToBridge(5);
	const registry = new Registry('asset-hub-paseo', {});
	const isForeignAssetsTransfer = true;
	const isLiquidTokenTransfer = false;

	describe('Destination', () => {
		it('Should work for V3', () => {
			const destId = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;
			const destination = v3Handler.createDest(destId);

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
			const destId = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}`;

			const destination = v4Handler.createDest(destId);

			const expectedRes = {
				V4: {
					parents: 2,
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

			const destination = v5Handler.createDest(destId);

			const expectedRes = {
				V5: {
					parents: 2,
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
				'asset-hub-westend',
				[`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Paseo"}}}`],
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
								parents: '2',
								interior: {
									X1: { GlobalConsensus: 'Paseo' },
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
				'asset-hub-westend',
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
				],
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
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(
				['10000000000'],
				'asset-hub-westend',
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
				],
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
