// Copyright 2023 Parity Technologies (UK) Ltd.

import { sanitizeAddress } from './sanitizeAddress';

describe('sanitizeAddress', () => {
	it('Should sanitize a SS58 address to the correct publicKey', () => {
		expect(
			sanitizeAddress('1ULZhwpUPLLg5VRYiq6rBHY8XaShAmBW7kqGBfvHBqrgBcN')
		).toEqual(
			'0x14d97bde56483534b553ec13c1867924b2eb559cbf9767090af5d8ecf8ee2936'
		);
	});
	it('Should return the public key if its already valid', () => {
		expect(
			sanitizeAddress(
				'0x14d97bde56483534b553ec13c1867924b2eb559cbf9767090af5d8ecf8ee2936'
			)
		).toEqual(
			'0x14d97bde56483534b553ec13c1867924b2eb559cbf9767090af5d8ecf8ee2936'
		);
	});
	it('Should error with an invalid address', () => {
		expect(() =>
			sanitizeAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU')
		).toThrowError('Invalid decoded address checksum');
	});
});
