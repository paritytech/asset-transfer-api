import { AssetTransferApi } from '../../AssetTransferApi';
import { Registry } from '../../registry';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi';
import { getXcmCreator } from '../xcm';
import { getXcAssetMultiLocationByAssetId } from './getXcAssetMultiLocationByAssetId';

const bifrostRegistry = new Registry('bifrost', {});
const bifrostApi = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 3, { registryType: 'NPM' });

const moonriverRegistry = new Registry('moonriver', {});
const moonriverApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'moonriver', 2, { registryType: 'NPM' });

describe('getXcAssetMultiLocationByAssetId', () => {
	describe('Bifrost', () => {
		bifrostRegistry.currentRelayRegistry['2001'].xcAssetsData = [
			{
				paraID: 1000,
				symbol: 'RMRK',
				decimals: 10,
				xcmV1MultiLocation:
					'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":8}]}}}',
				asset: {
					Token: 'RMRK',
				},
				assetHubReserveLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
			},
			{
				paraID: 1000,
				symbol: 'USDT',
				decimals: 6,
				xcmV1MultiLocation:
					'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
				asset: {
					Token2: '0',
				},
				assetHubReserveLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
			},
		];

		it('Should correctly return the multilocation when given a valid symbol assetId', async () => {
			const assetId = 'USDT';
			const xcmVersion = 3;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'bifrost';

			const expected =
				'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}';
			const result = await getXcAssetMultiLocationByAssetId({
				api: bifrostApi.api,
				assetId,
				specName,
				xcmCreator,
				registry: bifrostRegistry,
			});

			expect(result).toStrictEqual(expected);
		});

		it('Should correctly error when given an invalid symbol assetId', async () => {
			const assetId = 'vmover';
			const xcmVersion = 2;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'bifrost';

			await expect(async () => {
				await getXcAssetMultiLocationByAssetId({
					api: bifrostApi.api,
					assetId,
					specName,
					xcmCreator,
					registry: bifrostRegistry,
				});
			}).rejects.toThrow(`parachain assetId vmover is not a valid symbol assetId in bifrost`);
		});
	});

	describe('Moonriver', () => {
		moonriverRegistry.currentRelayRegistry['2023'].xcAssetsData = [
			{
				paraID: 2001,
				symbol: 'vBNC',
				decimals: 12,
				xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0101"}]}}}',
				asset: '72145018963825376852137222787619937732',
				assetHubReserveLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
			},
			{
				paraID: 2001,
				symbol: 'vMOVR',
				decimals: 18,
				xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x010a"}]}}}',
				asset: '203223821023327994093278529517083736593',
				assetHubReserveLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
			},
		];
		it('Should correctly return the multilocation when given a valid integer assetId', async () => {
			const assetId = '203223821023327994093278529517083736593';
			const xcmVersion = 2;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'moonriver';

			const expected = '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x010a"}]}}}';
			const result = await getXcAssetMultiLocationByAssetId({
				api: moonriverApi.api,
				assetId,
				specName,
				xcmCreator,
				registry: moonriverRegistry,
			});

			expect(result).toStrictEqual(expected);
		});

		it('Should correctly return the multilocation when given a valid symbol assetId', async () => {
			const assetId = 'vbnc';
			const xcmVersion = 2;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'moonriver';

			const expected = '{"v1":{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0101"}]}}}';
			const result = await getXcAssetMultiLocationByAssetId({
				api: moonriverApi.api,
				assetId,
				specName,
				xcmCreator,
				registry: moonriverRegistry,
			});

			expect(result).toStrictEqual(expected);
		});

		it('Should correctly error when given an invalid asset symbol', async () => {
			const assetId = 'mover';
			const xcmVersion = 2;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'moonriver';

			await expect(async () => {
				await getXcAssetMultiLocationByAssetId({
					api: moonriverApi.api,
					assetId,
					specName,
					xcmCreator,
					registry: moonriverRegistry,
				});
			}).rejects.toThrow(`parachain assetId mover is not a valid symbol assetIid in moonriver`);
		});

		it('Should correctly error when given an invalid integer assetId ', async () => {
			const assetId = '242424332422323423424';
			const xcmVersion = 2;
			const xcmCreator = getXcmCreator(xcmVersion);
			const specName = 'moonriver';

			await expect(async () => {
				await getXcAssetMultiLocationByAssetId({
					api: moonriverApi.api,
					assetId,
					specName,
					xcmCreator,
					registry: moonriverRegistry,
				});
			}).rejects.toThrow(`assetId 242424332422323423424 is not a valid symbol or integer asset id for moonriver`);
		});
	});
});
