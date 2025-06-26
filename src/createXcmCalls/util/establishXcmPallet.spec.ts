import { mockRelayApiV9420 } from '../../testHelpers/mockRelayApiV9420';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { establishXcmPallet } from './establishXcmPallet';

describe('establishXcmPallet', () => {
	it('Should detect xcmPallet pallet correctly', () => {
		const res = establishXcmPallet(mockRelayApiV9420);
		expect(res).toEqual('xcmPallet');
	});
	it('Should detect polkadotXcm pallet correctly', () => {
		const res = establishXcmPallet(mockSystemApi);
		expect(res).toEqual('polkadotXcm');
	});
	it('Should correctly throw an error when an overrided pallet is not found for the given runtime', () => {
		const xcmPalletOverride = 'xTokens';
		const err = () => establishXcmPallet(mockSystemApi, undefined, xcmPalletOverride);
		expect(err).toThrow('Pallet xTokens not found in the current runtime.');
	});
});
