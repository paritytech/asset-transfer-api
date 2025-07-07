import { DEFAULT_XCM_VERSION } from '../../consts';
import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { getXcmCreator } from '../xcm';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstanceId', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId({
			api: mockSystemApi,
			assetId: '1984',
			isLiquidToken: false,
			isForeignAsset: false,
			xcmCreator,
		});

		expect(res).toEqual(50);
	});
	it('Should correctly grab the poolAssets pallet instance', () => {
		const res = fetchPalletInstanceId({
			api: mockSystemApi,
			assetId: '0',
			isLiquidToken: true,
			isForeignAsset: false,
			xcmCreator,
		});

		expect(res).toEqual(55);
	});
	it('Should correctly grab the foreignAssets pallet instance', () => {
		const res = fetchPalletInstanceId({
			api: mockSystemApi,
			assetId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`,
			isLiquidToken: false,
			isForeignAsset: true,
			xcmCreator,
		});

		expect(res).toEqual(53);
	});
	it('Should correctly error when both foreign assets and pool assets are true', () => {
		const err = () =>
			fetchPalletInstanceId({
				api: mockSystemApi,
				assetId: '0',
				isLiquidToken: true,
				isForeignAsset: true,
				xcmCreator,
			});

		expect(err).toThrow("Can't find the appropriate pallet when both liquid tokens and foreign assets");
	});
	it('Should correctly error when the assets pallet is not found', () => {
		const err = () =>
			fetchPalletInstanceId({
				api: mockBifrostParachainApi,
				assetId: '0',
				isLiquidToken: false,
				isForeignAsset: false,
				xcmCreator,
			});

		expect(err).toThrow("No pallet available, can't find a valid PalletInstance.");
	});
});
