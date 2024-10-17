// Copyright 2023 Parity Technologies (UK) Ltd.

import { checkXcmVersion } from './checkXcmVersion.js';

describe('checkXcmVersion', () => {
	it('Should correctly throw an error on a unsupported version', () => {
		const err = () => checkXcmVersion(1);
		expect(err).toThrow('1 is not a supported xcm version. Supported versions are: 2, 3 and 4');
	});
});
