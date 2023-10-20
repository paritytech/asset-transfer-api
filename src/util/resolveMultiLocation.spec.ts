// Copyright 2023 Parity Technologies (UK) Ltd.

import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import { resolveMultiLocation } from './resolveMultiLocation';

describe('resolveMultiLocation', () => {
	it('Should return V3 for globalConsensus', () => {
		const str = '{"parents":2,"interior":{"x1":{"globalConsensus":{"polkadot":null}}}}';
		const res = resolveMultiLocation(adjustedMockSystemApi, str, 2);
		expect(res.toRawType()).toEqual('{"parents":"u8","interior":"XcmV3Junctions"}');
	});

	it('Should correctly throw an error when multiLocation contains a generalKey junction and the xcmVersion is not 2', () => {
		const str = `{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0001"}]}}`;
		const err = () => resolveMultiLocation(adjustedMockSystemApi, str, 3);

		expect(err).toThrow('XcmVersion must be version 2 for MultiLocations that contain a GeneralKey junction.');
	});

	it('Should correctly not throw an error when xcmVersion is 3 and the multiLocation does not contain a generalKey Junction', () => {
		const str = `{"parents":0,"interior":{"here": null}}`;
		const err = () => resolveMultiLocation(adjustedMockSystemApi, str, 3);

		expect(err).not.toThrow();
	});
});
