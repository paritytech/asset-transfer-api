// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transfer } from './transfer';

describe('transfer', () => {
	it('Should correctly build a poolAssets transfer', () => {
		const res = transfer(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			'0',
			'100000',
		);

		expect(res.toHex()).toEqual(
			'0xb00437080000000000f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b821a0600',
		);
	});
});
