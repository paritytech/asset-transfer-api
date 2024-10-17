// Copyright 2024 Parity Technologies (UK) Ltd.

import { UnionXcmMultiLocation } from '../../createXcmTypes/types.js';
import { mockSystemApi } from '../../testHelpers/mockSystemApi.js';
import { transferAll } from './transferAll.js';

describe('foreignAssets::transferAll', () => {
	it('Should construct a valid foreignAssets pallet transferAll extrinsic', () => {
		const foreignAsset = {
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
		} as UnionXcmMultiLocation;

		const res = transferAll(
			mockSystemApi,
			foreignAsset,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			true,
		);
		expect(res.toHex()).toEqual(
			'0xb00435200102003521050000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01',
		);
	});
});
