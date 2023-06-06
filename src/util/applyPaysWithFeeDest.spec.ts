// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../types';
import { applyPaysWithFeeDestination } from './applyPaysWithFeesDest';

describe('applyPaysWithFeeDestination', () => {
	it('Should properly place the relay chain asset multiasset in the 0 index when given asset id 0 for paysWithFeeDest', () => {
		const paysWithFeeDest = '0';
		const specName = 'polkadot';
		const expected: MultiAsset = {
			id: {
				Concrete: {
					parents: 1,
					interior: {
						Here: '',
					},
				},
			},
			fun: {
				Fungible: '100000000000000',
			},
		};

		const multiAssets: MultiAsset[] = [
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
		];

		expect(
			applyPaysWithFeeDestination(paysWithFeeDest, multiAssets, specName)
		).toEqual(expected);
		expect(multiAssets[0]).toEqual(expected);
	});

	it('Should select and update the multiasset array with the correct fee asset when given a token symbol', () => {
		const paysWithFeeDest = 'usdt';
		const specName = 'polkadot';
		const expected: MultiAsset = {
			id: {
				Concrete: {
					parents: 0,
					interior: {
						X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
					},
				},
			},
			fun: {
				Fungible: '100000000000000',
			},
		};

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
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
						},
					},
				},
				fun: {
					Fungible: '100000000000000',
				},
			},
		];

		expect(
			applyPaysWithFeeDestination(paysWithFeeDest, multiAssets, specName)
		).toEqual(expected);
		expect(multiAssets[0]).toEqual(expected);
	});

	it('Should select and update the multiasset array with the correct fee asset when given an assets Id as a string', () => {
		const paysWithFeeDest = '1337';
		const specName = 'polkadot';
		const expected: MultiAsset = {
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
		};

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
					Fungible: '100000000000000',
				},
			},
		];

		expect(
			applyPaysWithFeeDestination(paysWithFeeDest, multiAssets, specName)
		).toEqual(expected);
		expect(multiAssets[0]).toEqual(expected);
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
			applyPaysWithFeeDestination(paysWithFeeDest, multiAssets, specName);

		expect(err).toThrowError('general index for assetId xcUSDT was not found');
	});
});
