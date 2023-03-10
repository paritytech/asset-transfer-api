import { ApiPromise } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { Registry } from '@polkadot/types-codec/types/registry';

import { statemintV9370 } from '../../testHelpers/metadata/statemintV9370';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

const registry = new TypeRegistry() as unknown as Registry;
const metadata = new Metadata(registry, statemintV9370);

const getMetadata = () => Promise.resolve().then(() => metadata);

let mockApi: ApiPromise;

beforeEach(() => {
	mockApi = {
		rpc: {
			state: {
				getMetadata,
			},
		},
	} as unknown as ApiPromise;
});

describe('fetchPalletInstandId', () => {
	it('Should return the correct string when the api has the assets pallet', async () => {
		const res = await fetchPalletInstanceId(mockApi);

		expect(res).toEqual('50');
	});
	it('Should error when there is no Asset pallet available', async () => {
		mockApi = {
			rpc: {
				state: {
					getMetadata: () => {
						return {
							asV14: {
								pallets: [{ name: 'NotAssets' }],
							},
						};
					},
				},
			},
		} as unknown as ApiPromise;

		await expect(fetchPalletInstanceId(mockApi)).rejects.toThrowError(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	});
});
