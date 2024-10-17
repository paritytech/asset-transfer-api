// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi.js';
import { transferKeepAlive } from './transferKeepAlive.js';

describe('poolAssets::transferKeepAlive', () => {
	it('Should correctly build a poolAssets transferKeepAlive', () => {
		const res = transferKeepAlive(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			'0',
			'100000',
		);

		expect(res.toHex()).toEqual(
			'0xb00437090000000000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b821a0600',
		);
	});
});
