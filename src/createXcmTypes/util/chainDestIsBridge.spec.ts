import { DEFAULT_XCM_VERSION } from '../../consts';
import { getXcmCreator } from '../xcm';
import { chainDestIsBridge } from './chainDestIsBridge';

describe('chainDestIsBridge', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
	it('Should correctly return true for a GlobalConsensus destination location', () => {
		const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;

		const result = chainDestIsBridge({ destLocation, xcmCreator });

		expect(result).toEqual(true);
	});
	it('Should correctly return false for a destination location that does not contain a GlobalConsensus junction', () => {
		const destLocation = `{"parents":"2","interior":{"X1":{"Parachain":"2030"}}}`;

		const result = chainDestIsBridge({ destLocation, xcmCreator });

		expect(result).toEqual(false);
	});
});
