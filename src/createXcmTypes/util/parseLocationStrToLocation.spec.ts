import { DEFAULT_XCM_VERSION } from '../../consts';
import { parseLocationStrToLocation } from './parseLocationStrToLocation';

describe('parseLocationStrToLocation', () => {
	it('Should correctly return a valid UnionXcmMultilocation', () => {
		const locationStr = '{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}';
		const expected = {
			parents: '2',
			interior: {
				X2: [
					{
						GlobalConsensus: 'Polkadot',
					},
					{
						Parachain: '1000',
					},
				],
			},
		};
		const result = parseLocationStrToLocation({ locationStr, xcmCreator });

		expect(result).toEqual(expected);
	});
	it('Should correctly return a valid Ethereum UnionXcmMultilocation', () => {
		const locationStr = `{"parents":"2","interior":{"X1":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}]}}`;
		const expected = {
			parents: '2',
			interior: {
				X1: [
					{
						GlobalConsensus: {
							Ethereum: {
								chainId: '1',
							},
						},
					},
				],
			},
		};
		const result = parseLocationStrToLocation(locationStr, DEFAULT_XCM_VERSION);

		expect(result).toEqual(expected);
	});
	it('Should correctly error when an unparseable location string is provided', () => {
		const locationStr = '{"parents":"2","interior":{"X2":[{GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}';

		const err = () => parseLocationStrToLocation(locationStr, DEFAULT_XCM_VERSION);

		expect(err).toThrow(
			'Unable to parse {"parents":"2","interior":{"X2":[{GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}} as a valid location',
		);
	});
});
