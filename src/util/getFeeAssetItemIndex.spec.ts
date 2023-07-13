// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { AssetsTransferApi } from '../AssetsTransferApi';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import { MultiAsset } from '../types';
import { getFeeAssetItemIndex } from './getFeeAssetItemIndex';

type Test = [
	paysWithFeeDest: string,
	specName: string,
	multiAssets: MultiAsset[],
	api: ApiPromise,
	expected: number
];

describe('getFeeAssetItemIndex', () => {
	const systemAssetsApi = new AssetsTransferApi(
		adjustedMockSystemApi,
		'statemine',
		2
	);
	const relayAssetsApi = new AssetsTransferApi(
		adjustedMockRelayApi,
		'kusama',
		2
	);

	it('Should select and return the index of the correct multiassets when given their token symbols', async () => {
		const tests: Test[] = [
			[
				'usdt',
				'statemine',
				[
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 1,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ Here: '' }
									),
								}
							),
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }] }
									),
								}
							),
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				systemAssetsApi._api,
				0,
			],
			[
				'USDC',
				'statemine',
				[
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 1,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ Here: '' }
									),
								}
							),
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }] }
									),
								}
							),
						},
						fun: {
							Fungible: '1500',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }] }
									),
								}
							),
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

			expect(
				await getFeeAssetItemIndex(
					paysWithFeeDest,
					multiAssets,
					specName,
					api,
					false
				)
			).toEqual(expected);
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
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 1,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ Here: '' }
									),
								}
							),
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{
											X2: [{ PalletInstance: '50' }, { GeneralIndex: '8' }],
										}
									),
								}
							),
						},
						fun: {
							Fungible: '1500',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{
											X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
										}
									),
								}
							),
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
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 1,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{ Here: '' }
									),
								}
							),
						},
						fun: {
							Fungible: '1000',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{
											X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
										}
									),
								}
							),
						},
						fun: {
							Fungible: '1500',
						},
					},
					{
						id: {
							Concrete: systemAssetsApi._api.registry.createType(
								'MultiLocation',
								{
									parents: 0,
									interior: systemAssetsApi._api.registry.createType(
										'InteriorMultiLocation',
										{
											X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
										}
									),
								}
							),
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

			expect(
				await getFeeAssetItemIndex(
					paysWithFeeDest,
					multiAssets,
					specName,
					api,
					false
				)
			).toEqual(expected);
		}
	});

	it('Should throw an error indicating the general index was not found for an invalid paysWithFeeDest value', async () => {
		const paysWithFeeDest = 'xcUSDT';
		const specName = 'statemine';

		const multiAssets: MultiAsset[] = [
			{
				id: {
					Concrete: systemAssetsApi._api.registry.createType('MultiLocation', {
						parents: 1,
						interior: systemAssetsApi._api.registry.createType(
							'InteriorMultiLocation',
							{ Here: '' }
						),
					}),
				},
				fun: {
					Fungible: '100000000000000',
				},
			},
			{
				id: {
					Concrete: systemAssetsApi._api.registry.createType('MultiLocation', {
						parents: 0,
						interior: systemAssetsApi._api.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1337' }],
							}
						),
					}),
				},
				fun: {
					Fungible: '100000000000000',
				},
			},
		];

		await expect(async () => {
			await getFeeAssetItemIndex(
				paysWithFeeDest,
				multiAssets,
				specName,
				systemAssetsApi._api,
				false
			);
		}).rejects.toThrowError(
			'assetId xcUSDT is not a valid symbol or integer asset id for statemine'
		);
	});
});
