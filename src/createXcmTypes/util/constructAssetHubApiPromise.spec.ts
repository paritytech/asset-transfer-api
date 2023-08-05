// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { constructAssetHubApiPromise } from './constructAssetHubApiPromise';

describe('constructAssetHubApiPromise', () => {
	type Test = [expectedGenesisHash: string, registry: Registry];

	it('Should return the correct AssetHub ApiPromise', async () => {
		const tests: Test[] = [
			[
				'0x67f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c9',
				new Registry('westend', {}),
			],
			[
				'0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
				new Registry('kusama', {}),
			],
			[
				'0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
				new Registry('polkadot', {}),
			],
		];

		for (const test of tests) {
			const [expectedGenesisHash, registry] = test;

			const api = await constructAssetHubApiPromise(registry);

			expect(api.genesisHash.toString()).toEqual(expectedGenesisHash);
			await api.disconnect();
		}
	});
});
