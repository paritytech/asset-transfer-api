import { Registry } from '../../registry';
import { getXcmCreator } from '../xcm';
import { foreignAssetMultiLocationIsInCacheOrRegistry } from './foreignAssetMultiLocationIsInCacheOrRegistry';

describe('foreignAssetMultiLocationIsInCacheOrRegistry', () => {
	it('Should return true if a given foreign asset multilocation exists in the asset api registry', () => {
		const expected = true;
		const multiLocation = '{"parents":1,"interior":{ "X2":[{"Parachain":2125},{"GeneralIndex":0}]}}';
		const registry = new Registry('statemine', {});

		const xcmCreator = getXcmCreator(2);
		const foreignAssetExistsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(
			multiLocation,
			registry,
			xcmCreator,
		);

		expect(foreignAssetExistsInRegistry).toEqual(expected);
	});

	it('Should return false if a given foreign asset multilocation does not exist in the asset api registry', () => {
		const expected = false;
		const multiLocation = '{"parents":"1","interior":{"X1": {"Parachain":"200100510"}}}';
		const registry = new Registry('statemine', {});

		const xcmCreator = getXcmCreator(2);
		const foreignAssetExistsInRegistry = foreignAssetMultiLocationIsInCacheOrRegistry(
			multiLocation,
			registry,
			xcmCreator,
		);

		expect(foreignAssetExistsInRegistry).toEqual(expected);
	});
});
