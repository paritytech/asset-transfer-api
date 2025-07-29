import { AssetTransferApi } from '../../AssetTransferApi';
import { DEFAULT_XCM_VERSION } from '../../consts';
import { Registry } from '../../registry';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { getXcmCreator } from '../xcm';
import { getAssetId } from './getAssetId';

describe('getAssetId', () => {
	const xcmVersion = DEFAULT_XCM_VERSION;
	const xcmCreator = getXcmCreator(xcmVersion);
	describe('Statemine', () => {
		const registry = new Registry('statemine', {});
		const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', xcmVersion, {
			registryType: 'NPM',
		});
		it('Should correctly return the integer assetId when given a valid native system chain token symbol', async () => {
			const expected = '10';

			const result = await getAssetId({
				api: systemAssetsApi.api,
				registry,
				asset: 'USDC',
				specName: 'statemine',
				xcmCreator,
				isForeignAssetsTransfer: false,
			});

			expect(result).toEqual(expected);
		});

		it('Should correctly return the integer assetId when given a valid native system chain token assetId', async () => {
			const expected = '8';

			const result = await getAssetId({
				api: systemAssetsApi.api,
				registry,
				asset: 'RMRK',
				specName: 'statemine',
				xcmCreator,
				isForeignAssetsTransfer: false,
			});

			expect(result).toEqual(expected);
		});

		it('Should error when an asset id symbol is given that is not present in the registry or chain state', async () => {
			await expect(async () => {
				await getAssetId({
					api: systemAssetsApi.api,
					registry,
					asset: 'hello',
					specName: 'statemine',
					xcmCreator,
					isForeignAssetsTransfer: false,
				});
			}).rejects.toThrow('assetId hello is not a valid symbol, integer asset id or location for statemine');
		});

		it('Should correctly return the foreign asset multilocation when given a valid foreign asset multilocation', async () => {
			const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
			const expected = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';

			const result = await getAssetId({
				api: systemAssetsApi.api,
				registry,
				asset: multiLocation,
				specName: 'statemine',
				xcmCreator,
				isForeignAssetsTransfer: true,
			});

			expect(result).toEqual(expected);
		});

		it('Should correctly error when a foreign asset multilocation is given that is not present in the registry or chain state', async () => {
			const multiLocation = '{"parents":"1","interior":{"X1":{"Parachain":"212500000"}}}';

			await expect(async () => {
				await getAssetId({
					api: systemAssetsApi.api,
					registry,
					asset: multiLocation,
					specName: 'statemine',
					xcmCreator,
					isForeignAssetsTransfer: true,
				});
			}).rejects.toThrow(`MultiLocation ${multiLocation} not found`);
		});
	});

	describe('Bifrost', () => {
		const registry = new Registry('bifrost', {});
		const bifrostAssetsApi = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', xcmVersion, {
			registryType: 'NPM',
		});

		it('Should correctly return the xcAsset multilocation when given a valid asset symbol', async () => {
			const expected = '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2023},{"palletInstance":10}]}}}';

			const result = await getAssetId({
				api: bifrostAssetsApi.api,
				registry,
				asset: 'movr',
				specName: 'bifrost',
				xcmCreator,
				isForeignAssetsTransfer: false,
			});

			expect(result).toEqual(expected);
		});

		it('Should correctly error when given an invalid xcAsset symbol', async () => {
			await expect(async () => {
				await getAssetId({
					api: bifrostAssetsApi.api,
					registry,
					asset: 'TEST',
					specName: 'bifrost',
					xcmCreator,
					isForeignAssetsTransfer: true,
				});
			}).rejects.toThrow(`parachain assetId TEST is not a valid symbol assetId in bifrost`);
		});
	});

	describe('Moonriver', () => {
		const registry = new Registry('moonriver', {});
		const moonriverAssetsApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'bifrost', xcmVersion, {
			registryType: 'NPM',
		});

		it('Should correctly return the xcAsset integer assetId when given a valid xcAsset symbol', async () => {
			const expected = '42259045809535163221576417993425387648';

			const result = await getAssetId({
				api: moonriverAssetsApi.api,
				registry,
				asset: 'xcKSM',
				specName: 'bifrost',
				xcmCreator,
				isForeignAssetsTransfer: false,
			});

			expect(result).toEqual(expected);
		});

		it('Should correctly return the integer xcAssetId when given a valid integer xcAssetId', async () => {
			const expected = '42259045809535163221576417993425387648';

			const result = await getAssetId({
				api: moonriverAssetsApi.api,
				registry,
				asset: '42259045809535163221576417993425387648',
				specName: 'moonriver',
				xcmCreator,
				isForeignAssetsTransfer: false,
			});

			expect(result).toEqual(expected);
		});

		it('Should correctly error when given an invalid xcAsset symbol', async () => {
			await expect(async () => {
				await getAssetId({
					api: moonriverAssetsApi.api,
					registry,
					asset: 'TEST',
					specName: 'moonriver',
					xcmCreator,
					isForeignAssetsTransfer: true,
				});
			}).rejects.toThrow(`parachain assetId TEST is not a valid symbol assetId in moonriver`);
		});

		it('Should correctly error when given an invalid integer xcAssetId', async () => {
			await expect(async () => {
				await getAssetId({
					api: moonriverAssetsApi.api,
					registry,
					asset: '25830838603860',
					specName: 'moonriver',
					xcmCreator,
					isForeignAssetsTransfer: true,
				});
			}).rejects.toThrow(`parachain assetId 25830838603860 is not a valid integer assetId in moonriver`);
		});
	});
});
