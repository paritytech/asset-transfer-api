// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { MultiAsset } from '../../types';
import { sortMultiAssetsAscending } from './sortMultiAssetsAscending';

describe('sortMultiAssetsAscending', () => {
	it('Should sort an unsorted multi asset array in ascending order', () => {
		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								Here: '',
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
							}
						),
						parents: 0,
					}),
				},
			},
		];

		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								Here: '',
							}
						),
						parents: 0,
					}),
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length - 1].fun).toEqual(expected[expected.length - 1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});
	it('Should sort an unsorted multiasset which includes a GeneralKey MultiLocation', () => {
		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X1: {
									GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
								},
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								Here: '',
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
							}
						),
						parents: 0,
					}),
				},
			},
		];

		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X1: {
									GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978',
								},
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '10' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								Here: '',
							}
						),
						parents: 0,
					}),
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length-1].fun).toEqual(expected[expected.length-1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});

	it('Should sort an unsorted foreign asset multiasset array', () => {
		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }],
							}
						),
						parents: 1,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X1: { Parachain: '2023' },
							}
						),
						parents: 1,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X3: [
									{ Parachain: '2023' },
									{ PalletInstance: '50' },
									{ GeneralIndex: '1984' },
								],
							}
						),
						parents: 1,
					}),
				},
			},
		];

		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X1: { Parachain: '2023' },
							}
						),
						parents: 1,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }],
							}
						),
						parents: 1,
					}),
				},
			},
			{
				fun: {
					Fungible: '300000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('MultiLocation', {
						interior: mockSystemApi.registry.createType(
							'InteriorMultiLocation',
							{
								X3: [
									{ Parachain: '2023' },
									{ PalletInstance: '50' },
									{ GeneralIndex: '1984' },
								],
							}
						),
						parents: 1,
					}),
				},
			},
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res[0].id).toEqual(expected[0].id);
		expect(res[res.length-1].fun).toEqual(expected[expected.length-1].fun);
		expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
	});
});
