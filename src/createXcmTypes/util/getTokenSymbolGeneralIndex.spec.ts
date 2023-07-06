// Copyright 2023 Parity Technologies (UK) Ltd.

import { getSystemChainTokenSymbolGeneralIndex } from './getTokenSymbolGeneralIndex';

describe('getSystemChainTokenSymbolGeneralIndex', () => {
	it('Should successfully return the general index when given a valid native system chain token symbol', () => {
		const expected = '1337';

		const result = getSystemChainTokenSymbolGeneralIndex('USDC', 'statemint');

		expect(result).toEqual(expected);
	});

	it('Should error when an asset id symbol is given that is not present in the registry', () => {
		const err = () =>
			getSystemChainTokenSymbolGeneralIndex('NOTUSDT', 'statemint');

		expect(err).toThrow('general index for assetId NOTUSDT was not found');
	});
});
