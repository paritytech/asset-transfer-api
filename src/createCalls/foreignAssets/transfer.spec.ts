// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transfer } from './transfer';

describe('transfer', () => {
	it('Should construct a valid foreignAsset transfer extrinsic', () => {
		const foreignAsset = mockSystemApi.createType('MultiLocation', {
			parents: '1',
			interior: mockSystemApi.registry.createType('InteriorMultiLocation', {
				X2: [
					{
						Parachain: '2125',
					},
					{
						GeneralIndex: '0',
					},
				],
			}),
		});

		const res = transfer(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			foreignAsset,
			'10000'
		);
		expect(res.toHex()).toEqual(
			'0xb40435080102003521050000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b419c'
		);
	});
});
