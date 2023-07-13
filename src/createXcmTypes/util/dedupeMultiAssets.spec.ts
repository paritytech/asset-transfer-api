// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { MultiAsset } from '../../types';
import { dedupeMultiAssets } from './dedupeMultiAssets';

describe('dedupeMultiAssets', () => {
	it('Should dedupe a sorted list of MultiAssets', () => {
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
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
						parents: 1,
					}),
				},
			},
		];
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
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
							}
						),
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
});
