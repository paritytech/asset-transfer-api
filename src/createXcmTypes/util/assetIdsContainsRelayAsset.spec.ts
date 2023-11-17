// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { assetIdsContainRelayAsset } from './assetIdsContainsRelayAsset';
import { mockAssetRegistry } from '../../testHelpers/mockAssetRegistry';

describe('assetIdsContainsRelayAsset', () => {
	it('Should return true when assetIds contains relay chain symbol', () => {
		const registry = new Registry('statemine', mockAssetRegistry);
		const assetIds = ['ksm', 'usdt', 'usdc'];

		const result = assetIdsContainRelayAsset(assetIds, registry);

		expect(result).toEqual(true);
	});
	it('Should return true when assetIds is an empty array', () => {
		const registry = new Registry('statemint', mockAssetRegistry);
		const assetIds = ['dot', 'usdt', 'usdc'];

		const result = assetIdsContainRelayAsset(assetIds, registry);

		expect(result).toEqual(true);
	});
	it('Should return true when assetIds contains the relay assets multilocation', () => {
		const registry = new Registry('asset-hub-polkadot', mockAssetRegistry);
		const assetIds = [
			`{"parents": 1, "interior": {"Here": ''}}`,
			`{"parents": 1, interior: {"X1": {"Parachain": "2023"}}}`,
		];

		const result = assetIdsContainRelayAsset(assetIds, registry);

		expect(result).toEqual(true);
	});
	it('Should return false when assetIds does not contain the relay assets multilocation', () => {
		const registry = new Registry('statemine', mockAssetRegistry);
		const assetIds = [`{"parents": 1, interior: {"X1": {"Parachain": "2023"}}}`];

		const result = assetIdsContainRelayAsset(assetIds, registry);

		expect(result).toEqual(false);
	});
	it('Should return false when assetIds does not contain the relay assets symbol', () => {
		const registry = new Registry('statemine', mockAssetRegistry);
		const assetIds = ['usdc', 'usdt'];

		const result = assetIdsContainRelayAsset(assetIds, registry);

		expect(result).toEqual(false);
	});
});
