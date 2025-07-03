import { AssetTransferApi } from '../../AssetTransferApi';
import { adjustedMockSystemApiV1016000 } from '../../testHelpers/adjustedMockSystemApiV1016000';
import { getPaysWithFeeOriginAssetLocationFromRegistry } from './getPaysWithFeeOriginAssetLocationFromRegistry';

describe('getPaysWithFeeOriginAssetLocationFromRegistry', () => {
	const assetHubAPI = new AssetTransferApi(adjustedMockSystemApiV1016000, 'asset-hub-westend', 4, {
		registryType: 'NPM',
	});

	it('Should correctly return the asset location of a valid Assets Pallet integer asset ID on AssetHub', () => {
		const paysWithFeeOriginAssetId = '1984';
		const expected = {
			parents: 0,
			interior: {
				X2: [
					{
						PalletInstance: 50,
					},
					{
						GeneralIndex: '1984',
					},
				],
			},
		};

		const result = getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, paysWithFeeOriginAssetId);

		expect(result).toEqual(expected);
	});
	it('Should correctly return the asset location of a valid unique Assets Pallet asset symbol on AssetHub', () => {
		const paysWithFeeOriginAssetId = 'RSD';
		const expected = {
			parents: 0,
			interior: {
				X2: [
					{
						PalletInstance: 50,
					},
					{
						GeneralIndex: '22061',
					},
				],
			},
		};

		const result = getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, paysWithFeeOriginAssetId);

		expect(result).toEqual(expected);
	});
	it('Should correctly return the asset location of a valid Foreign Assets Pallet asset symbol on AssetHub', () => {
		const paysWithFeeOriginAssetId = 'WMYTH';
		const expected = {
			parents: '1',
			interior: {
				X1: [
					{
						Parachain: '3368',
					},
				],
			},
		};

		const result = getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, paysWithFeeOriginAssetId);

		expect(result).toEqual(expected);
	});

	it('Should correctly return the asset location of a valid foreign asset symbol on AssetHub', () => {
		const paysWithFeeOriginAssetId = '1984';
		const expected = {
			parents: 0,
			interior: {
				X2: [
					{
						PalletInstance: 50,
					},
					{
						GeneralIndex: '1984',
					},
				],
			},
		};

		const result = getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, paysWithFeeOriginAssetId);

		expect(result).toEqual(expected);
	});
	it('Should correctly return undefined when an asset ID is not found', () => {
		expect(getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, 'DOESNOTEXIST')).toEqual(undefined);
	});
	it('Should correctly return undefined when an empty paysWithFeeOrigin value is passed in', () => {
		expect(getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, '')).toEqual(undefined);
	});
	it('Should correctly error when given a non unique asset symbol', () => {
		const paysWithFeeOriginAssetId = 'USDT';

		const err = () => getPaysWithFeeOriginAssetLocationFromRegistry(assetHubAPI, paysWithFeeOriginAssetId);

		// the result of this test might change (more assets can be added) when the asset-transfer-api-registry is updated.
		expect(err).toThrow(
			`Multiple assets found with symbol USDT:\nassetId: 66 symbol: USDT\nassetId: 67 symbol: USDT\nassetId: 2000 symbol: USDT\nassetId: 8888 symbol: USDT\nassetId: 55555 symbol: USDT\nassetId: 50000091 symbol: USDt\nassetId: 50000123 symbol: USDT\nassetId: 4000000012 symbol: USDT\nPlease provide an integer assetId or valid asset location for paysWithFeeOrigin rather than the token symbol`,
		);
	});
});
