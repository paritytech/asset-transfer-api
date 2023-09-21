// Copyright 2023 Parity Technologies (UK) Ltd.

import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import { resolveMultiLocation } from './resolveMultiLocation';

describe('resolveMultiLocation', () => {
	it('Should return V3 for globalConsensus', () => {
		const str = '{"parents":2,"interior":{"x1":{"globalConsensus":{"polkadot":null}}}}';
		const res = resolveMultiLocation(adjustedMockSystemApi, str, 2);
		expect(res.toRawType()).toEqual('{"parents":"u8","interior":"XcmV3Junctions"}');
	});
});
