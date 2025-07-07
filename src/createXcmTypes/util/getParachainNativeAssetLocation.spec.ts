import { DEFAULT_XCM_VERSION } from '../../consts';
import { Registry } from '../../registry';
import { getXcmCreator } from '../xcm';
import { getParachainNativeAssetLocation } from './getParachainNativeAssetLocation';

describe('getParachainNativeAssetLocation', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
	it('Correctly returns the native asset location for Moonbeam', () => {
		const registry = new Registry('moonbeam', {});

		const res = getParachainNativeAssetLocation({
			registry,
			nativeAssetSymbol: 'GLMR',
			destChainId: '2034',
			xcmCreator,
		});

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"PalletInstance":"10"}}}');
	});
	it('Correctly returns the native asset location for Moonriver', () => {
		const registry = new Registry('moonriver', {});

		const res = getParachainNativeAssetLocation({
			registry,
			nativeAssetSymbol: 'MOVR',
			destChainId: '2001',
			xcmCreator,
		});

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"PalletInstance":"10"}}}');
	});
	it('Correctly returns the native asset location for Phala', () => {
		const registry = new Registry('phala', {});

		const res = getParachainNativeAssetLocation({
			registry,
			nativeAssetSymbol: 'PHA',
			destChainId: '2034',
			xcmCreator,
		});

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":[{"Parachain":"2035"}]}}');
	});
	it('Correctly returns the native asset location for Hydration', () => {
		const registry = new Registry('hydradx', {});

		const res = getParachainNativeAssetLocation({
			registry,
			nativeAssetSymbol: 'HDX',
			destChainId: '2004',
			xcmCreator,
		});

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"GeneralIndex":"0"}}}');
	});
	it('Correctly returns the native asset location for Hydration when destination is AssetHub', () => {
		const registry = new Registry('hydradx', {});

		const res = getParachainNativeAssetLocation({
			registry,
			nativeAssetSymbol: 'HDX',
			destChainId: '1000',
			xcmCreator,
		});

		expect(JSON.stringify(res)).toEqual('{"parents":0,"interior":{"X1":{"GeneralIndex":"0"}}}');
	});
	it('correctly throws an error when no valid location is found for the given native asset', () => {
		const registry = new Registry('moonbeam', {});

		const err = () =>
			getParachainNativeAssetLocation({ registry, nativeAssetSymbol: 'GLMR', destChainId: '3369', xcmCreator });

		expect(err).toThrow('No location found for asset GLMR');
	});
});
