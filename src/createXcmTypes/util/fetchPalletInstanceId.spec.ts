import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstanceId', () => {
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId(mockSystemApi, '1984', false, false);

		expect(res).toEqual(50);
	});
	it('Should correctly grab the poolAssets pallet instance', () => {
		const res = fetchPalletInstanceId(mockSystemApi, '0', true, false);

		expect(res).toEqual(55);
	});
	it('Should correctly grab the foreignAssets pallet instance', () => {
		const res = fetchPalletInstanceId(
			mockSystemApi,
			`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`,
			false,
			true,
		);

		expect(res).toEqual(53);
	});
	it('Should correctly error when both foreign assets and pool assets are true', () => {
		const err = () => fetchPalletInstanceId(mockSystemApi, '0', true, true);

		expect(err).toThrow("Can't find the appropriate pallet when both liquid tokens and foreign assets");
	});
	it('Should correctly error when the assets pallet is not found', () => {
		const err = () => fetchPalletInstanceId(mockBifrostParachainApi, '0', false, false);

		expect(err).toThrow("No pallet available, can't find a valid PalletInstance.");
	});
});
