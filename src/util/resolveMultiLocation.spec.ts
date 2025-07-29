import { DEFAULT_XCM_VERSION } from '../consts';
import { getXcmCreator } from '../createXcmTypes/xcm';

describe('resolveMultiLocation', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
	it('Should correctly not throw an error when the multiLocation does not contain a generalKey Junction', () => {
		const str = `{"parents":0,"interior":{"here": null}}`;
		const err = () => xcmCreator.resolveMultiLocation(str);

		expect(err).not.toThrow();
	});
	it('Should correctly return a resolved multilocation object given a correct value', () => {
		const str = `{"parents":1,"interior":{"x2":[{"parachain":2001},{"generalKey":"0x0001"}]}}`;
		const exp = { parents: '1', interior: { X2: [{ Parachain: '2001' }, { GeneralKey: '0x0001' }] } };

		expect(xcmCreator.resolveMultiLocation(str)).toStrictEqual(exp);
	});
	it('Should correctly return a resolved X1 location object given a correct value', () => {
		const str = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`;
		const exp = { parents: '2', interior: { X1: [{ GlobalConsensus: 'Polkadot' }] } };

		expect(xcmCreator.resolveMultiLocation(str)).toStrictEqual(exp);
	});
	it('Should correctly error when xcmVersion is less than 3 and the asset location contains a GlobalConsensus junction', () => {
		const str = `{"parents":1,"interior":{"x1":{"GlobalConsensus":"Kusama"}}}`;
		const xcmCreatorV2 = getXcmCreator(2);
		const err = () => xcmCreatorV2.resolveMultiLocation(str);

		expect(err).toThrow(
			'XcmVersion must be greater than 2 for MultiLocations that contain a GlobalConsensus junction.',
		);
	});
	it('Should correctly resolve an xcmV1Multilocation values location', () => {
		const str = `{"v1":{"parents":1,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}`;
		const exp = {
			parents: '1',
			interior: {
				X2: [
					{ GlobalConsensus: { Ethereum: { chainId: '1' } } },
					{ AccountKey20: { network: null, key: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' } },
				],
			},
		};

		expect(xcmCreator.resolveMultiLocation(str)).toStrictEqual(exp);
	});
});

describe('resoleMultiLocation - legacy parseLocationStrToLocation tests', () => {
	const xcmCreator = getXcmCreator(DEFAULT_XCM_VERSION);
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
		const result = xcmCreator.resolveMultiLocation(locationStr);

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
		const result = xcmCreator.resolveMultiLocation(locationStr);

		expect(result).toEqual(expected);
	});
	it('Should correctly error when an unparseable location string is provided', () => {
		const locationStr = '{"parents":"2","interior":{"X2":[{GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}';

		const err = () => xcmCreator.resolveMultiLocation(locationStr);

		expect(err).toThrow(
			'Unable to parse {"parents":"2","interior":{"X2":[{GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}} as a valid location',
		);
	});
});
