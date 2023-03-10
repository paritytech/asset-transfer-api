import { ApiPromise } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { Registry } from '@polkadot/types-codec/types/registry';

import { statemintV9370 } from '../../testHelpers/metadata/statemintV9370';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

const registry = new TypeRegistry() as unknown as Registry;
const metadata = new Metadata(registry, statemintV9370);

const getMetadata = () => Promise.resolve().then(() => metadata);

const mockApi = {
	rpc: {
		state: {
			getMetadata,
		},
	},
} as unknown as ApiPromise;

describe('fetchPalletInstandId', () => {
	it('should work', async () => {
		const res = await fetchPalletInstanceId(mockApi);

		expect(res).toEqual('50');
	});
});
