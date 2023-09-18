// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../../AssetTransferApi';
import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApi';
import { getAssetId } from './getAssetId';

describe('getAssetId', () => {
	const registry = new Registry('statemine', {});
	const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2);
	it('Should correctly return the integer assetId when given a valid native system chain token symbol', async () => {
		const expected = '10';

		const result = await getAssetId(systemAssetsApi._api, registry, 'USDC', 'statemine', false);

		expect(result).toEqual(expected);
	});

	it('Should correctly return the integer assetId when given a valid native system chain token assetId', async () => {
		const expected = '8';

		const result = await getAssetId(systemAssetsApi._api, registry, 'RMRK', 'statemine', false);

		expect(result).toEqual(expected);
	});

	it('Should error when an asset id symbol is given that is not present in the registry or chain tate', async () => {
		await expect(async () => {
			await getAssetId(systemAssetsApi._api, registry, 'hello', 'statemine', false);
		}).rejects.toThrowError('assetId hello is not a valid symbol or integer asset id');
	});

	it('Should correctly return the foreign asset multilocation when given a valid foreign asset multilocation', async () => {
		const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
		const expected = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';

		const result = await getAssetId(systemAssetsApi._api, registry, multiLocation, 'statemine', true);

		expect(result).toEqual(expected);
	});

	it('Should correctly error when a foreign asset multilocation is given that is not present in the registry or chain state', async () => {
		const multiLocation = '{"parents":"1","interior":{"X1":{"Parachain":"212500000"}}}';

		await expect(async () => {
			await getAssetId(systemAssetsApi._api, registry, multiLocation, 'statemine', true);
		}).rejects.toThrowError(`MultiLocation ${multiLocation} not found`);
	});
});
