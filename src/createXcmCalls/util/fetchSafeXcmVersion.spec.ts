// Copyright 2023 Parity Technologies (UK) Ltd.

import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000.js';
import { fetchSafeXcmVersion } from './fetchSafeXcmVersion.js';

describe('fetchSafeXcmVersion', () => {
	it('Should return the correct value when the Option is true', async () => {
		const version = await fetchSafeXcmVersion(adjustedMockSystemApi);
		expect(version).toEqual(2);
	});
});
