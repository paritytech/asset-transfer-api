import type { XcmMultiLocation } from '../../createXcmTypes/types';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transfer } from './transfer';

describe('foreignAssets::transfer', () => {
	it('Should construct a valid foreignAsset transfer extrinsic', () => {
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
		} as XcmMultiLocation;

		const res = transfer(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			foreignAsset,
			'10000',
		);
		expect(res.toHex()).toEqual(
			'0xb40435080102003521050000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b419c',
		);
	});
});
