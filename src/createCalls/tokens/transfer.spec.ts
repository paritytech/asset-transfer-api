// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi.js';
import { transfer } from './transfer.js';

describe('tokens::transfer', () => {
	it('transfer', () => {
		const res = transfer(mockBifrostParachainApi, 'djSk4JfeBVmDA6T4yuTZajjZGmn9h8hcSH1NE6mGE4UdFv3', 'dot', '1000000');
		expect(res.toHex()).toEqual(
			'0xa80447000058d75e286e10ad6c94094927df2ef747b39864dcf3c7aff55a7696915b1e0785020302093d00',
		);
	});
});
