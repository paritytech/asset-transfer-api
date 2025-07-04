import { ApiPromise } from '@polkadot/api';

import { AssetTransferApi } from '../AssetTransferApi';
import { FungibleMultiAsset } from '../createXcmTypes/types';
import { getXcmCreator } from '../createXcmTypes/xcm';
import { Registry } from '../registry';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApiV9420';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApiV1004000';
import { getFeeAssetItemIndex } from './getFeeAssetItemIndex';

type Test = [
	paysWithFeeDest: string,
	specName: string,
	multiAssets: FungibleMultiAsset[],
	api: ApiPromise,
	expected: number,
];

describe('getFeeAssetItemIndex', () => {
	const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
	const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2, { registryType: 'NPM' });
	const registry = new Registry('statemine', {});

	it('Should select and return the index of the correct multiassets when given their token symbols', async () => {
		const xcmVersion = 2;
		const xcmCreator = getXcmCreator(xcmVersion);
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
				systemAssetsApi.api,
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
				systemAssetsApi.api,
				2,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(
				await getFeeAssetItemIndex({
					api,
					registry,
					paysWithFeeDest,
					multiAssets,
					specName,
					xcmCreator,
					isForeignAssetsTransfer: false,
				}),
			).toEqual(expected);
		}
	});

	it('Should select and return the index of the correct multiasset when given an assets Id as a string', async () => {
		const xcmVersion = 2;
		const xcmCreator = getXcmCreator(xcmVersion);
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
				relayAssetsApi.api,
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
				relayAssetsApi.api,
				1,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(
				await getFeeAssetItemIndex({
					api,
					registry,
					paysWithFeeDest,
					multiAssets,
					specName,
					xcmCreator,
					isForeignAssetsTransfer: false,
				}),
			).toEqual(expected);
		}
	});

	it('Should correctly select and return the index of the correct multiassets when given a foreign assets multilocation', async () => {
		const xcmVersion = 2;
		const xcmCreator = getXcmCreator(xcmVersion);
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
				systemAssetsApi.api,
				0,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, api, expected] = test;

			expect(
				await getFeeAssetItemIndex({
					api,
					registry,
					paysWithFeeDest,
					multiAssets,
					specName,
					xcmCreator,
					isForeignAssetsTransfer: true,
				}),
			).toEqual(expected);
		}
	});

	it('Should throw an error indicating the general index was not found for an invalid paysWithFeeDest value', async () => {
		const paysWithFeeDest = '1984';
		const specName = 'statemine';
		const xcmVersion = 2;
		const xcmCreator = getXcmCreator(xcmVersion);

		const multiAssets: FungibleMultiAsset[] = [
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
			await getFeeAssetItemIndex({
				api: systemAssetsApi.api,
				registry,
				paysWithFeeDest,
				multiAssets,
				specName,
				xcmCreator,
				isForeignAssetsTransfer: false,
			});
		}).rejects.toThrow(
			'Invalid paysWithFeeDest value. 1984 did not match any asset in assets: {"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1337"}]},{"Here":""}',
		);
	});
});
