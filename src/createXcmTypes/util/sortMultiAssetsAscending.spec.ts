// Copyright 2023 Parity Technologies (UK) Ltd.

import { FungibleObjMultiAsset, FungibleStrMultiAsset } from '../../createXcmTypes/types';
import { sortMultiAssetsAscending } from './sortMultiAssetsAscending';

describe('sortMultiAssetsAscending', () => {
	it('Should sort an unsorted multi asset array in ascending order', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '300000000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 0,
						interior: {
							Here: '',
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
						parents: 0,
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 0,
						interior: {
							Here: '',
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
						parents: 0,
					},
				},
			},
			{
				fun: {
					Fungible: '300000000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toStrictEqual(JSON.stringify(expected));
	});

	it('Should sort an unsorted multi foreign asset array of X1s in ascending order', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort an unsorted multi asset array with the same `parents` and `Junction`type based on their `Junction` keys', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort an unsorted multiasset array with in ascending order when parents values are different', () => {
		// TODO: verify if the refactor of this test is correct.
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 0,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								PalletInstance: '50',
							},
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								PalletInstance: '50',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 0,
						interior: {
							X1: {
								GeneralKey: '0xA83397cEfcCFdE9re7B23F3g0C462eF099E9E995',
							},
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort based on differing first Junction key value for X2s when other fields are the same', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort based on differing third Junction key value for X3s when all other fields are the same', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort different X2 MultiLocations', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort based on differing GeneralIndex values for X3s when all other fields are the same', () => {
		const multiAssets: FungibleObjMultiAsset[] = [
			{
				fun: {
					Fungible: { Fungible: '200000000' },
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: { Fungible: '200000000' },
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
						},
					},
				},
			},
		];

		const expected: FungibleObjMultiAsset[] = [
			{
				fun: {
					Fungible: { Fungible: '200000000' },
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: { Fungible: '200000000' },
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets) as FungibleObjMultiAsset[];

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort based on differing third Junction keys for X3s when all other fields are the same', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [
								{ Parachain: '2000' },
								{ PalletInstance: '50' },
								{ GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' },
							],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [
								{ Parachain: '2000' },
								{ PalletInstance: '50' },
								{ GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' },
							],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should sort an unsorted multi foreign asset array of Here, X1s and X2s in ascending order', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '55' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							Here: '',
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							Here: '',
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2000' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ Parachain: '2023' }, { GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '55' }, { GeneralIndex: '0' }],
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X1: {
								GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: {
						parents: 2,
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly sort an unsorted multiasset array based on fungible value when all other values are the same', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: {
						parents: 1,
						interior: {
							X1: {
								Parachain: '2023',
							},
						},
					},
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res.length).toEqual(expected.length);
		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});
});
