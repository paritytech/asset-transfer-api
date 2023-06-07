// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { MultiAsset } from '../../types';
import { createSystemToParaMultiAssets } from './createSystemToParaMultiAssets';

describe('createSystemToParaMultiAssets', () => {
	it('Should correctly create system multi assets for SystemToPara xcm direction', () => {
		const expected: MultiAsset[] = [
			{
				fun: {
					Fungible: '100000000000000',
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
					Fungible: '300000000000000',
				},
				id: {
					Concrete: {
						interior: {
							X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
						},
						parents: 0,
					},
				},
			},
		];

		const assets = ['ksm', 'usdt'];
		const amounts = ['100000000000000', '300000000000000'];
		const specName = 'kusama';
		const result = createSystemToParaMultiAssets(
			mockSystemApi,
			amounts,
			specName,
			assets
		);

		expect(result).toEqual(expected);
	});
});
