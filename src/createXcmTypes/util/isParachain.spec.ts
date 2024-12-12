// Copyright 2023 Parity Technologies (UK) Ltd.

import { isParachain } from './isParachain';

describe('isParachain', () => {
	it('Should correctly return true for a chainId of 2001', () => {
		const result = isParachain('2001');

		expect(result).toEqual(true);
	});
	it('Should correctly return false for a chainId of 1000', () => {
		const result = isParachain('1000');

		expect(result).toEqual(false);
	});
	it('Should correctly return false for a chainId of 0', () => {
		const result = isParachain('0');

		expect(result).toEqual(false);
	});
});
