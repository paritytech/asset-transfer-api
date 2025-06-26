import { assetIdIsLocation } from './assetIdIsLocation';

describe('assetIdIsLocation', () => {
	it('Should correctly return true for a valid location assetId string', () => {
		const assetId = `{"parents":"1","interior":{"X2":[{"Parchain":"2004"},{"PalletInstance":"10"}]}}`;

		expect(assetIdIsLocation(assetId)).toBe(true);
	});
	it('Should correctly return false for an invalid location assetId string', () => {
		const assetId = `{"parents":"1"}`;

		expect(assetIdIsLocation(assetId)).toBe(false);
	});
	it('Should correctly return false for an inter assetId string', () => {
		const assetId = `1984`;

		expect(assetIdIsLocation(assetId)).toBe(false);
	});
	it('Should correctly return false for a symbol assetId string', () => {
		const assetId = `usdt`;

		expect(assetIdIsLocation(assetId)).toBe(false);
	});
});
