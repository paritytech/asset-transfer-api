// Copyright 2023 Parity Technologies (UK) Ltd.

import type { UnionXcmMultiLocation } from '../../createXcmTypes/types';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transferKeepAlive } from './transferKeepAlive';

describe('foreignAssets::transfer', () => {
	it('Should construct a valid foreignAssets transferKeepAlive extrinsic', () => {
		const foreignAssetMultiLocation = {
			parents: 1,
			interior: {
				X2: [
					{
						Parachain: '2125',
					},
					{
						GeneralIndex: '0',
					},
				],
			},
		} as unknown as UnionXcmMultiLocation;

		const res = transferKeepAlive(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			foreignAssetMultiLocation,
			'10000',
		);
		expect(res.toHex()).toEqual(
			'0xb40435090102003521050000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b419c',
		);
	});
});
