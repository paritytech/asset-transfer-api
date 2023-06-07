// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../types';
import { getFeeAssetItemIndex } from './getFeeAssetItemIndex';

type Test = [
	paysWithFeeDest: string,
	specName: string,
	multiAssets: MultiAsset[],
	expected: number
];

describe('getFeeAssetItemIndex', () => {
	it('Should select and return the index of the correct multiassets when given their token symbols', () => {
		const tests: Test[] = [
			[
				'usdt',
				'polkadot',
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
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
								},
							},
						},
						fun: {
							Fungible: '2000',
						},
					},
				],
				1,
			],
			[
				'USDC',
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
				2,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, expected] = test;

			expect(
				getFeeAssetItemIndex(paysWithFeeDest, multiAssets, specName)
			).toEqual(expected);
		}
	});

	it('Should select and return the index of the correct multiasset when given an assets Id as a string', () => {
		const tests: Test[] = [
			[
				'1984',
				'polkadot',
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
									X2: [{ PalletInstance: '50' }, { GeneralIndex: '1337' }],
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
				2,
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
				1,
			],
		];

		for (const test of tests) {
			const [paysWithFeeDest, specName, multiAssets, expected] = test;

			expect(
				getFeeAssetItemIndex(paysWithFeeDest, multiAssets, specName)
			).toEqual(expected);
		}
	});

	it('Should throw an error indicating the general index was not found for an invalid paysWithFeeDest value', () => {
		const paysWithFeeDest = 'xcUSDT';
		const specName = 'polkadot';

		const multiAssets: MultiAsset[] = [
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
		];

		const err = () =>
			getFeeAssetItemIndex(paysWithFeeDest, multiAssets, specName);

		expect(err).toThrowError('general index for assetId xcUSDT was not found');
	});
});
