// Copyright 2023 Parity Technologies (UK) Ltd.

import { resolveMultiLocation } from './resolveMultiLocation';

describe('resolveMultiLocation', () => {
	it('Should return V3 for globalConsensus', () => {
		const str = '{"parents":2,"interior":{"x1":{"globalConsensus":{"polkadot":null}}}}';
		expect(resolveMultiLocation(str, 2)).toEqual('XcmV3MultiLocation');
	});
});
