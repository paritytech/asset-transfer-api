import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { fetchSafeXcmVersion } from './fetchSafeXcmVersion';

describe('fetchSafeXcmVersion', () => {
	it('Should return the correct value when the Option is true', async () => {
		const version = await fetchSafeXcmVersion(adjustedMockSystemApi);
		expect(version).toEqual(2);
	});
});
