// Copyright 2023 Parity Technologies (UK) Ltd.

import { validateAddress } from './validateAddress';

describe('validateAddress', () => {
	it('Should not error with a valid substrate address', () => {
		expect(validateAddress('5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG')).toEqual([true, undefined]);
	});
	it('Should not error with a valid hex address', () => {
		expect(validateAddress('0x14d97bde56483534b553ec13c1867924b2eb559cbf9767090af5d8ecf8ee2936')).toEqual([
			true,
			undefined,
		]);
	});
	it('Should not error with a valid ethereum address', () => {
		expect(validateAddress('0x96Bd611EbE3Af39544104e26764F4939924F6Ece')).toEqual([true, undefined]);
	});
	it('Should error with a nonsense address', () => {
		expect(validateAddress('hello')).toEqual([false, 'Invalid base58 character "l" (0x6c) at index 2']);
	});
	it('Should error with an address with invalid decoded address checksum', () => {
		expect(validateAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU')).toEqual([
			false,
			'Invalid decoded address checksum',
		]);
	});
	it('Should error with an address missing some bytes', () => {
		expect(validateAddress('y9EMHt34JJo4rWLSaxoLGdYXvjgSXEd4zHUnQgfNzwES8b')).toEqual([
			false,
			'Invalid address format',
		]);
	});
});
