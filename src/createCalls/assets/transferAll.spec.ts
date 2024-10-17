// Copyright 2024 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi.js';
import { transferAll } from './transferAll.js';

describe('assets::transferAll', () => {
	it('Should construct a valid assets pallet transferAll extrinsic', () => {
		const res = transferAll(
			mockSystemApi,
			'1',
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			true,
		);
		expect(res.toHex()).toEqual('0x980432200400f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01');
	});
});
