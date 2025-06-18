// Copyright 2023 Parity Technologies (UK) Ltd.

import type { FungibleMultiAsset } from '../types';
import { dedupeAssets } from './dedupeAssets';

describe('dedupeAssets', () => {
	it('Should dedupe a sorted list of Assets', () => {
		const expected: FungibleMultiAsset[] = [
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
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					},
				},
			},
		];
		const Assets: FungibleMultiAsset[] = [
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
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					},
				},
			},
		];

		const deduped = dedupeAssets(Assets);

		expect(deduped.length).toEqual(expected.length);
		expect(deduped[1].fun.Fungible).toEqual(expected[1].fun.Fungible);
		expect(JSON.stringify(deduped)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly dedupe a sorted list of foreign asset Assets', () => {
		const Assets: FungibleMultiAsset[] = [
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

		const expected: FungibleMultiAsset[] = [
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
		const deduped = dedupeAssets(Assets);

		expect(deduped.length).toEqual(expected.length);
		expect(deduped[1].fun.Fungible).toEqual(expected[1].fun.Fungible);
		expect(JSON.stringify(deduped)).toEqual(JSON.stringify(expected));
	});
});
