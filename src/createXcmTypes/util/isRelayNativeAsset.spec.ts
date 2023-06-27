import { isRelayNativeAsset } from './isRelayNativeAsset';

describe('isRelayNativeAsset', () => {
	const tokens = ['KSM'];
	it('Should return true', () => {
		expect(isRelayNativeAsset(tokens, 'KSM')).toEqual(true);
	});
	it('Should return false', () => {
		expect(isRelayNativeAsset(tokens, 'DOT')).toEqual(false);
	});
});
