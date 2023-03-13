import type { ApiPromise } from '@polkadot/api';

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstandId', () => {
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId(mockSystemApi);

		expect(res).toEqual('50');
	});
	it('Should error when there is no Asset pallet available', () => {
		const mockApi = {
			registry: {
				metadata: {
					pallets: [{ name: 'NotAssets' }],
				},
			},
		} as unknown as ApiPromise;
		const res = () => fetchPalletInstanceId(mockApi);

		expect(res).toThrowError(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	});
});
