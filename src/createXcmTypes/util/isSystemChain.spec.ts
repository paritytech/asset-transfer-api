// Copyright 2023 Parity Technologies (UK) Ltd.

import { isSystemChain } from './isSystemChain';

describe('isSystemChain', () => {
	it('Should correctly return true for a chainId of 1000', () => {
		const result = isSystemChain('1000');

		expect(result).toEqual(true);
	});
	it('Should correctly return false for a chainId of 2000', () => {
		const result = isSystemChain(2000);

		expect(result).toEqual(false);
	});
    it('Should correctly return false for a chainId of 0', () => {
		const result = isSystemChain('0');

		expect(result).toEqual(false);
	});
});
