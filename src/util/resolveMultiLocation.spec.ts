// Copyright 2023 Parity Technologies (UK) Ltd.

import { resolveMultiLocation } from './resolveMultiLocation';

describe('resolveMultiLocation', () => {
	it('Should correctly throw an error when multiLocation contains a generalKey junction and the xcmVersion is not 2', () => {
		const str = `{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0001"}]}}`;
		const err = () => resolveMultiLocation(str, 3);

		expect(err).toThrow('XcmVersion must be version 2 for MultiLocations that contain a GeneralKey junction.');
	});
	it('Should correctly not throw an error when xcmVersion is 3 and the multiLocation does not contain a generalKey Junction', () => {
		const str = `{"parents":0,"interior":{"here": null}}`;
		const err = () => resolveMultiLocation(str, 3);

		expect(err).not.toThrow();
	});
	it('Should correctly return a resolved multilocation object given a correct value', () => {
		const str = `{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0001"}]}}`;
		const exp = { Parents: 1, Interior: { X2: [{ Parachain: 2001 }, { GeneralKey: '0x0001' }] } };

		expect(resolveMultiLocation(str, 2)).toStrictEqual(exp);
	});
});
