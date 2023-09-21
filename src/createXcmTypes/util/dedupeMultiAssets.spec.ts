// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import type { FungibleStrMultiAsset } from '../../types';
import { dedupeMultiAssets } from './dedupeMultiAssets';

describe('dedupeMultiAssets', () => {
	it('Should dedupe a sorted list of MultiAssets', () => {
		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					}),
				},
			},
		];
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '100000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 0,
					}),
				},
			},
			{
				fun: {
					Fungible: '200000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
						parents: 1,
					}),
				},
			},
		];

		const deduped = dedupeMultiAssets(multiAssets);

		expect(deduped.length).toEqual(expected.length);
		expect(deduped[1].fun.Fungible).toEqual(expected[1].fun.Fungible);
		expect(JSON.stringify(deduped)).toEqual(JSON.stringify(expected));
	});

	it('Should correctly dedupe a sorted list of foreign asset MultiAssets', () => {
		const multiAssets: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						parents: 1,
						interior: {
							X3: [
								{ Parachain: '2000' },
								{ PalletInstance: '50' },
								{ GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' },
							],
						},
					}),
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						parents: 1,
						interior: {
							X3: [
								{ Parachain: '2000' },
								{ PalletInstance: '50' },
								{ GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' },
							],
						},
					}),
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					}),
				},
			},
		];

		const expected: FungibleStrMultiAsset[] = [
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						parents: 1,
						interior: {
							X3: [
								{ Parachain: '2000' },
								{ PalletInstance: '50' },
								{ GeneralKey: '0xA73397cE0cCFdE92e7B23F3d0C462eF099E9E978' },
							],
						},
					}),
				},
			},
			{
				fun: {
					Fungible: '200000000',
				},
				id: {
					Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
						parents: 1,
						interior: {
							X3: [{ Parachain: '2000' }, { PalletInstance: '50' }, { GeneralIndex: '1' }],
						},
					}),
				},
			},
		];
		const deduped = dedupeMultiAssets(multiAssets);

		expect(deduped.length).toEqual(expected.length);
		expect(deduped[1].fun.Fungible).toEqual(expected[1].fun.Fungible);
		expect(JSON.stringify(deduped)).toEqual(JSON.stringify(expected));
	});
});
