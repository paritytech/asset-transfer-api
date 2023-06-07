// Copyright 2023 Parity Technologies (UK) Ltd.

import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApi';
import { fetchSafeXcmVersion } from './fetchSafeXcmVersion';

describe('fetchSafeXcmVersion', () => {
	it('Should return the correct value when the Option is true', async () => {
		const version = await fetchSafeXcmVersion(adjustedMockSystemApi);
		expect(version.toNumber()).toEqual(2);
	});
});
