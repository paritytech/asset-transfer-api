// Copyright 2023 Parity Technologies (UK) Ltd.

import { checkLocalRelayInput } from './checkLocalRelayInput';
import { LocalTxType } from './types';

describe('checkLocalRelayInput', () => {
	it('Should return LocalTxType.Balances', () => {
		const res = checkLocalRelayInput([], ['10000']);
		expect(res).toEqual(LocalTxType.Balances);
	});
	it('Should error with an invalid input', () => {
		expect(() => checkLocalRelayInput(['dot', 'ksm'], ['100000'])).toThrow(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
		);
	});
});
