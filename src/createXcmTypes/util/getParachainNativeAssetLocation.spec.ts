import { Registry } from '../../registry';
import { getParachainNativeAssetLocation } from './getParachainNativeAssetLocation';

describe('getParachainNativeAssetLocation', () => {
	it('Correctly returns the native asset location for Moonbeam', () => {
		const registry = new Registry('moonbeam', {});

		const res = getParachainNativeAssetLocation(registry, 'GLMR', '2034');

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"PalletInstance":"10"}}}');
	});
	it('Correctly returns the native asset location for Moonriver', () => {
		const registry = new Registry('moonriver', {});

		const res = getParachainNativeAssetLocation(registry, 'MOVR', '2001');

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"PalletInstance":"10"}}}');
	});
	it('Correctly returns the native asset location for Phala', () => {
		const registry = new Registry('phala', {});

		const res = getParachainNativeAssetLocation(registry, 'PHA', '2034');

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"Parachain":"2035"}}}');
	});
	it('Correctly returns the native asset location for Hydration', () => {
		const registry = new Registry('hydradx', {});

		const res = getParachainNativeAssetLocation(registry, 'HDX', '2004');

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"GeneralIndex":"0"}}}');
	});
	it('Correctly returns the native asset location for Hydration when destination is AssetHub', () => {
		const registry = new Registry('hydradx', {});

		const res = getParachainNativeAssetLocation(registry, 'HDX', '1000');

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"GeneralIndex":"0"}}}');
	});
	it('correctly throws an error when no valid location is found for the given native asset', () => {
		const registry = new Registry('moonbeam', {});

		const err = () => getParachainNativeAssetLocation(registry, 'GLMR', '3369');

		expect(err).toThrow('No location found for asset GLMR');
	});
});
