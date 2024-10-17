// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../../AssetTransferApi.js';
import { Registry } from '../../registry/index.js';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi.js';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi.js';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000.js';
import { getAssetId } from './getAssetId.js';

describe('getAssetId', () => {
	describe('Statemine', () => {
		const registry = new Registry('statemine', {});
		const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
		it('Should correctly return the integer assetId when given a valid native system chain token symbol', async () => {
			const expected = '10';

			const result = await getAssetId(systemAssetsApi.api, registry, 'USDC', 'statemine', 2, false);

			expect(result).toEqual(expected);
		});

		it('Should correctly return the integer assetId when given a valid native system chain token assetId', async () => {
			const expected = '8';

			const result = await getAssetId(systemAssetsApi.api, registry, 'RMRK', 'statemine', 2, false);

			expect(result).toEqual(expected);
		});

		it('Should error when an asset id symbol is given that is not present in the registry or chain state', async () => {
			await expect(async () => {
				await getAssetId(systemAssetsApi.api, registry, 'hello', 'statemine', 2, false);
			}).rejects.toThrow('assetId hello is not a valid symbol, integer asset id or location for statemine');
		});

		it('Should correctly return the foreign asset multilocation when given a valid foreign asset multilocation', async () => {
			const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
			const expected = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';

			const result = await getAssetId(systemAssetsApi.api, registry, multiLocation, 'statemine', 2, true);

			expect(result).toEqual(expected);
		});

		it('Should correctly error when a foreign asset multilocation is given that is not present in the registry or chain state', async () => {
			const multiLocation = '{"parents":"1","interior":{"X1":{"Parachain":"212500000"}}}';

			await expect(async () => {
				await getAssetId(systemAssetsApi.api, registry, multiLocation, 'statemine', 2, true);
			}).rejects.toThrow(`MultiLocation ${multiLocation} not found`);
		});
	});

	describe('Bifrost', () => {
		const registry = new Registry('bifrost', {});
		const bifrostAssetsApi = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 2, {
			registryType: 'NPM',
		});

		it('Should correctly return the xcAsset multilocation when given a valid asset symbol', async () => {
			const expected = '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2023},{"palletInstance":10}]}}}';

			const result = await getAssetId(bifrostAssetsApi.api, registry, 'movr', 'bifrost', 2, false);

			expect(result).toEqual(expected);
		});

		it('Should correctly error when given an invalid xcAsset symbol', async () => {
			await expect(async () => {
				await getAssetId(bifrostAssetsApi.api, registry, 'TEST', 'bifrost', 2, true);
			}).rejects.toThrow(`parachain assetId TEST is not a valid symbol assetId in bifrost`);
		});
	});

	describe('Moonriver', () => {
		const registry = new Registry('moonriver', {});
		const moonriverAssetsApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'bifrost', 2, {
			registryType: 'NPM',
		});

		it('Should correctly return the xcAsset integer assetId when given a valid xcAsset symbol', async () => {
			const expected = '42259045809535163221576417993425387648';

			const result = await getAssetId(moonriverAssetsApi.api, registry, 'xcKSM', 'bifrost', 2, false);

			expect(result).toEqual(expected);
		});

		it('Should correctly return the integer xcAssetId when given a valid integer xcAssetId', async () => {
			const expected = '42259045809535163221576417993425387648';

			const result = await getAssetId(
				moonriverAssetsApi.api,
				registry,
				'42259045809535163221576417993425387648',
				'moonriver',
				2,
				false,
			);

			expect(result).toEqual(expected);
		});

		it('Should correctly error when given an invalid xcAsset symbol', async () => {
			await expect(async () => {
				await getAssetId(moonriverAssetsApi.api, registry, 'TEST', 'moonriver', 2, true);
			}).rejects.toThrow(`parachain assetId TEST is not a valid symbol assetIid in moonriver`);
		});

		it('Should correctly error when given an invalid integer xcAssetId', async () => {
			await expect(async () => {
				await getAssetId(moonriverAssetsApi.api, registry, '25830838603860', 'moonriver', 2, true);
			}).rejects.toThrow(`parachain assetId 25830838603860 is not a valid integer assetIid in moonriver`);
		});
	});
});
