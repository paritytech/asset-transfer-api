import { Registry } from '../../registry';
import { adjustedMockRelayApi } from '../../testHelpers/adjustedMockRelayApiV9420';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { getXcmCreator } from '../xcm';
import { createAssetLocations } from './createAssetLocations';

describe('createAssetLocations', () => {
	describe('Kusama AssetHub', () => {
		const registry = new Registry('statemine', {});

		it('Should correctly create asset locations for XCM V5', async () => {
			const expected = {
				V5: [
					{
						id: {
							parents: '0',
							interior: {
								X2: [
									{
										PalletInstance: '50',
									},
									{
										GeneralIndex: '1984',
									},
								],
							},
						},
						fun: {
							Fungible: '300000000000000',
						},
					},
					{
						id: {
							parents: '1',
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = [
				`{"parents":"1","interior":{"Here":""}}`,
				`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`,
			];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const xcmCreator = getXcmCreator(5);
			const result = await createAssetLocations({
				api: mockSystemApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '1000',
				assetIdsContainLocations: true,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V4', async () => {
			const expected = {
				V4: [
					{
						id: {
							parents: '0',
							interior: {
								X2: [
									{
										PalletInstance: '50',
									},
									{
										GeneralIndex: '1984',
									},
								],
							},
						},
						fun: {
							Fungible: '300000000000000',
						},
					},
					{
						id: {
							parents: '1',
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = [
				`{"parents":"1","interior":{"Here":""}}`,
				`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`,
			];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const xcmCreator = getXcmCreator(4);
			const result = await createAssetLocations({
				api: mockSystemApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '1000',
				assetIdsContainLocations: true,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V3', async () => {
			const expected = {
				V3: [
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
							Fungible: '300000000000000',
						},
					},
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
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const xcmCreator = getXcmCreator(3);
			const result = await createAssetLocations({
				api: mockSystemApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '1000',
				assetIdsContainLocations: false,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V2', async () => {
			const expected = {
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
							Fungible: '300000000000000',
						},
					},
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
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const xcmCreator = getXcmCreator(2);
			const result = await createAssetLocations({
				api: mockSystemApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '1000',
				assetIdsContainLocations: false,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
	});
	describe('Kusama', () => {
		const registry = new Registry('kusama', {});

		it('Should correctly create asset locations for XCM V5', async () => {
			const expected = {
				V5: [
					{
						id: {
							parents: '0',
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = [`{"parents":"0","interior":{"Here":""}}`];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const xcmCreator = getXcmCreator(5);
			const result = await createAssetLocations({
				api: adjustedMockRelayApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '0',
				assetIdsContainLocations: true,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V4', async () => {
			const expected = {
				V4: [
					{
						id: {
							parents: '0',
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = [`{"parents":"0","interior":{"Here":""}}`];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const xcmCreator = getXcmCreator(4);
			const result = await createAssetLocations({
				api: adjustedMockRelayApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '0',
				assetIdsContainLocations: true,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V3', async () => {
			const expected = {
				V3: [
					{
						id: {
							Concrete: {
								parents: '0',
								interior: {
									Here: '',
								},
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm'];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const xcmCreator = getXcmCreator(3);
			const result = await createAssetLocations({
				api: adjustedMockRelayApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '0',
				assetIdsContainLocations: false,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V2', async () => {
			const expected = {
				V2: [
					{
						id: {
							Concrete: {
								parents: '0',
								interior: {
									Here: '',
								},
							},
						},
						fun: {
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm'];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const xcmCreator = getXcmCreator(2);
			const result = await createAssetLocations({
				api: adjustedMockRelayApi,
				assetIds: assets,
				specName,
				amounts,
				registry,
				originChainId: '0',
				assetIdsContainLocations: false,
				isLiquidTokenTransfer: false,
				xcmCreator,
			});

			expect(result).toStrictEqual(expected);
		});
	});
});
