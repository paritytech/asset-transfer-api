import { DEFAULT_XCM_VERSION } from '../../consts';
import { getXcmCreator } from '../xcm';
import { assetIdIsLocation } from './assetIdIsLocation';

describe('assetIdIsLocation', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
	it('Should correctly return true for a valid location assetId string', () => {
		const assetId = `{"parents":"1","interior":{"X2":[{"Parchain":"2004"},{"PalletInstance":"10"}]}}`;

		expect(assetIdIsLocation({ assetId, xcmCreator })).toBe(true);
	});
	it('Should correctly return false for an invalid location assetId string', () => {
		const assetId = `{"parents":"1"}`;

		expect(assetIdIsLocation({ assetId, xcmCreator })).toBe(false);
	});
	it('Should correctly return false for an inter assetId string', () => {
		const assetId = `1984`;

		expect(assetIdIsLocation({ assetId, xcmCreator })).toBe(false);
	});
	it('Should correctly return false for a symbol assetId string', () => {
		const assetId = `usdt`;

		expect(assetIdIsLocation({ assetId, xcmCreator })).toBe(false);
	});
});
