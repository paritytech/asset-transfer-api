// Copyright 2024 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transferAll } from './transferAll';

describe('transferAll', () => {
	it('Should construct a valid poolAssets pallet transferAll extrinsic', () => {
		const res = transferAll(
			mockSystemApi,
			'1',
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			true,
		);
		expect(res.toHex()).toEqual(
			'0xa40437200100000000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01',
		);
	});
});
