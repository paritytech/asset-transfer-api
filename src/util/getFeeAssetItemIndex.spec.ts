// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { AssetTransferApi } from '../AssetTransferApi';
import { Registry } from '../registry';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import { FungibleStrMultiAsset } from '../createXcmTypes/types';
import { getFeeAssetItemIndex } from './getFeeAssetItemIndex';

type Test = [
	paysWithFeeDest: string,
	specName: string,
	multiAssets: FungibleStrMultiAsset[],
	api: ApiPromise,
	expected: number
];

describe('getFeeAssetItemIndex', () => {
	const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2);
	const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2);
	const registry = new Registry('statemine', {});

	it('Should select and return the index of the correct multiassets when given their token symbols', async () => {
		const tests: Test[] = [
			[
				'rmrk',
				'statemine',
				[
					{
						id: {
							Concrete: {
								parents: 1,
								interior: { Here: '' },
							},
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '8' }],
								},
							},
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				systemAssetsApi._api,
				1,
			],
			[
				'USDC',
				'statemine',
				[
					{
						id: {
							Concrete: {
								parents: 1,
								interior: { Here: '' },
							},
						},
						fun: {
							Fungible: '1000',
						},
					},
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
							Fungible: '1500',
						},
					},
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
								},
							},
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				systemAssetsApi._api,
				2,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(await getFeeAssetItemIndex(api, registry, paysWithFeeDest, multiAssets, specName, 2, false)).toEqual(
				expected
			);
		}
	});

	it('Should select and return the index of the correct multiasset when given an assets Id as a string', async () => {
		const tests: Test[] = [
			[
				'8',
				'kusama',
				[
					{
						id: {
							Concrete: {
								parents: 1,
								interior: { Here: '' },
							},
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '8' }],
								},
							},
						},
						fun: {
							Fungible: '1500',
						},
					},
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
								},
							},
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				relayAssetsApi._api,
				1,
			],
			[
				'10',
				'kusama',
				[
					{
						id: {
							Concrete: {
								parents: 1,
								interior: { Here: '' },
							},
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
								},
							},
						},
						fun: {
							Fungible: '1500',
						},
					},
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
							Fungible: '2000',
						},
					},
				],
				relayAssetsApi._api,
				1,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(await getFeeAssetItemIndex(api, registry, paysWithFeeDest, multiAssets, specName, 2, false)).toEqual(
				expected
			);
		}
	});

	it('Should correctly select and return the index of the correct multiassets when given a foreign assets multilocation', async () => {
		const tests: Test[] = [
			[
				`{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}`,
				'statemine',
				[
					{
						id: {
							Concrete: {
								parents: 1,
								interior: {
									X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }],
								},
							},
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				systemAssetsApi._api,
				0,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(await getFeeAssetItemIndex(api, registry, paysWithFeeDest, multiAssets, specName, 2, true)).toEqual(
				expected
			);
		}
	});

	it('Should throw an error indicating the general index was not found for an invalid paysWithFeeDest value', async () => {
		const paysWithFeeDest = '1984';
		const specName = 'statemine';

		const multiAssets: FungibleStrMultiAsset[] = [
			{
				id: {
					Concrete: {
						parents: 0,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1337' }],
						},
					},
				},
				fun: {
					Fungible: '100000000000000',
				},
			},
			{
				id: {
					Concrete: {
						parents: 1,
						interior: { Here: '' },
					},
				},
				fun: {
					Fungible: '100000000000000',
				},
			},
		];

		await expect(async () => {
			await getFeeAssetItemIndex(systemAssetsApi._api, registry, paysWithFeeDest, multiAssets, specName, 2, false);
		}).rejects.toThrowError(
			'Invalid paysWithFeeDest value. 1984 did not match any asset in assets: {\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1337\"}]},{\"Here\":\"\"}'
		);
	});
});
