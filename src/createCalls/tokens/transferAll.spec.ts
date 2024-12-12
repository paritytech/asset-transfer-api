// Copyright 2024 Parity Technologies (UK) Ltd.

import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { transferAll } from './transferAll';

describe('tokens::transferAll', () => {
	it('Should construct a valid ORML tokens pallet transferAll extrinsic', () => {
		const res = transferAll(mockBifrostParachainApi, 'djSk4JfeBVmDA6T4yuTZajjZGmn9h8hcSH1NE6mGE4UdFv3', 'dot', true);
		expect(res.toHex()).toEqual('0x9c0447010058d75e286e10ad6c94094927df2ef747b39864dcf3c7aff55a7696915b1e0785020301');
	});
});
