// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../types';
import { applyPaysWithFeeDestination } from './applyPaysWithFeesDest';

describe('applyPaysWithFeeDestination', () => {
	it('Should select and update the multiasset array with the correct fee asset when given a token symbol', () => {
		const paysWithFeeDest = 'usdt';
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

		const assets: string[] = ['DOT', 'USDT'];
		const multiAssets: MultiAsset[] = [
			{
				id: {
					Concrete: {
						parents: 0,
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
			applyPaysWithFeeDestination(paysWithFeeDest, assets, multiAssets)
		).toEqual(expected);
		expect(multiAssets[0]).toEqual(expected);
	});

	it('Should select and update the multiasset array with the correct fee asset when given an assets Id as a string', () => {
		const paysWithFeeDest = '1337';
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

		const assets: string[] = ['DOT', '1337', 'USDT'];
		const multiAssets: MultiAsset[] = [
			{
				id: {
					Concrete: {
						parents: 0,
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
			applyPaysWithFeeDestination(paysWithFeeDest, assets, multiAssets)
		).toEqual(expected);
		expect(multiAssets[0]).toEqual(expected);
	});

	it('Should return a message indicating the multiassets were not updated if paysWithFeeDest matches no assets in list', () => {
		const paysWithFeeDest = 'xcUSDT';
		const expected = 'destination chain fee asset was not updated';

		const assets: string[] = ['DOT', 'USDC'];
		const multiAssets: MultiAsset[] = [
			{
				id: {
					Concrete: {
						parents: 0,
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

		expect(
			applyPaysWithFeeDestination(paysWithFeeDest, assets, multiAssets)
		).toEqual(expected);
	});
});
