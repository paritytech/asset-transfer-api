// Copyright 2023 Parity Technologies (UK) Ltd.

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
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
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
					Fungible: '300000',
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

		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '300000',
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
					Fungible: '100000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
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
		];

		const res = sortMultiAssetsAscending(multiAssets);

		expect(res).toEqual(expected);
	});
});
