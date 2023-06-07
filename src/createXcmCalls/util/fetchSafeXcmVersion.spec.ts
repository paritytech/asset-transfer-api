// Copyright 2023 Parity Technologies (UK) Ltd.

import { fetchSafeXcmVersion } from './fetchSafeXcmVersion';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApi';

describe('fetchSafeXcmVersion', () => {
    it('Should return the correct value when the Option is true', async () => {
        const version = await fetchSafeXcmVersion(adjustedMockSystemApi);
        expect(version.toNumber()).toEqual(2);
    });
})
