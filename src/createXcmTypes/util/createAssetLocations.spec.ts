// Copyright 2024 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry/index.js';
import { adjustedMockRelayApi } from '../../testHelpers/adjustedMockRelayApiV9420.js';
import { mockSystemApi } from '../../testHelpers/mockSystemApi.js';
import { createAssetLocations } from './createAssetLocations.js';

describe('createAssetLocations', () => {
	describe('Kusama AssetHub', () => {
		const registry = new Registry('statemine', {});

		it('Should correctly create asset locations for XCM V4', async () => {
			const expected = {
				V4: [
					{
						id: {
							Parents: '0',
							Interior: {
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
							Parents: '1',
							Interior: {
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
			const result = await createAssetLocations(
				mockSystemApi,
				assets,
				specName,
				amounts,
				4,
				registry,
				'1000',
				true,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V3', async () => {
			const expected = {
				V3: [
					{
						id: {
							Concrete: {
								parents: 0,
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
								parents: 1,
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
			const result = await createAssetLocations(
				mockSystemApi,
				assets,
				specName,
				amounts,
				3,
				registry,
				'1000',
				false,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V2', async () => {
			const expected = {
				V2: [
					{
						id: {
							Concrete: {
								parents: 0,
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
								parents: 1,
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
			const result = await createAssetLocations(
				mockSystemApi,
				assets,
				specName,
				amounts,
				2,
				registry,
				'1000',
				false,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
	});
	describe('Kusama', () => {
		const registry = new Registry('kusama', {});

		it('Should correctly create asset locations for XCM V4', async () => {
			const expected = {
				V4: [
					{
						id: {
							Parents: '0',
							Interior: {
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
			const result = await createAssetLocations(
				adjustedMockRelayApi,
				assets,
				specName,
				amounts,
				4,
				registry,
				'0',
				true,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V3', async () => {
			const expected = {
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
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm'];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const result = await createAssetLocations(
				adjustedMockRelayApi,
				assets,
				specName,
				amounts,
				3,
				registry,
				'0',
				false,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
		it('Should correctly create asset locations for XCM V2', async () => {
			const expected = {
				V2: [
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
							Fungible: '100000000000000',
						},
					},
				],
			};

			const assets = ['ksm'];
			const amounts = ['100000000000000'];
			const specName = 'kusama';
			const result = await createAssetLocations(
				adjustedMockRelayApi,
				assets,
				specName,
				amounts,
				2,
				registry,
				'0',
				false,
				false,
			);

			expect(result).toStrictEqual(expected);
		});
	});
});
