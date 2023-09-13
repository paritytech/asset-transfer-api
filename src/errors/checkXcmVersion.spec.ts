// Copyright 2023 Parity Technologies (UK) Ltd.

import { checkXcmVersion } from './checkXcmVersion';

describe('checkXcmVersion', () => {
	it('Should correctly throw an error on a unsupported version', () => {
		const err = () => checkXcmVersion(1);
		expect(err).toThrowError('1 is not a supported xcm version. Supported versions are: 2 and 3');
	});
});
