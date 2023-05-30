// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';
import { sortMultiAssetsAscending } from './sortMultiAssetsAscending';

describe('sortMultiAssetsAscending', () => {
	it('Should sort an unsorted multi asset array in ascending order', () => {
		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
			{
				fun: {
					Fungible: '340282366920938463463374607431768211455',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
		];

		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '340282366920938463463374607431768211455',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: {
						interior: {
							Here: '',
						},
						parents: 0,
					},
				},
			},
		];

		sortMultiAssetsAscending(multiAssets);

		expect(multiAssets[0].fun.Fungible).toEqual(expected[0].fun.Fungible);
		expect(multiAssets[1].fun.Fungible).toEqual(expected[1].fun.Fungible);
		expect(multiAssets[2].fun.Fungible).toEqual(expected[2].fun.Fungible);
	});
});
