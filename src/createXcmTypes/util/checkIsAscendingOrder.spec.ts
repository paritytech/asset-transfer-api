// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';
import { isAscendingOrder } from './checkIsAscendingOrder';

describe('isAscendingOrder', () => {
	it('Should return false if MultiAsset array is not in ascending order', () => {
		const expected = false;

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
						parents: 1,
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
						parents: 1,
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
						parents: 1,
					},
				},
			},
		];

		const result = isAscendingOrder(multiAssets);

		expect(result).toEqual(expected);
	});

	it('Should return true if MultiAsset array is in ascending order', () => {
		const expected = true;

		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '500000',
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
					Fungible: '700000',
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

		const result = isAscendingOrder(multiAssets);

		expect(result).toEqual(expected);
	});

	it('Should return true if all values in a MultiAsset array are equal', () => {
		const expected = true;

		const multiAssets: MultiAsset[] = [
			{
				fun: {
					Fungible: '1000000',
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
					Fungible: '1000000',
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

		const result = isAscendingOrder(multiAssets);

		expect(result).toEqual(expected);
	});
});
