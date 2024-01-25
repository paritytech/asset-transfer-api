// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { mockMoonriverParachainApi } from '../../testHelpers/mockMoonriverParachainApi';
import { checkLocalParachainInput } from './checkLocalParachainInput';
import { LocalTxType } from './types';

describe('checkLocalParachainInput', () => {
	it('Should return LocalTxType.Balances', () => {
		const res = checkLocalParachainInput(mockBifrostParachainApi, [], ['10000']);
		expect(res).toEqual(LocalTxType.Balances);
	});
	it('Should return LocalTxType.Tokens', () => {
		const res = checkLocalParachainInput(mockBifrostParachainApi, ['dot'], ['10000']);
		expect(res).toEqual(LocalTxType.Tokens);
	});
	it("Should correctly error when the tokens pallet doesn'nt exist", () => {
		expect(() => checkLocalParachainInput(mockMoonriverParachainApi, ['ksm'], ['10000'])).toThrow(
			'Given the inputted assets, no Tokens pallet was found for a local transfer.',
		);
	});
});
