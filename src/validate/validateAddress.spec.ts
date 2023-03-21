import { validateAddress } from './validateAddress';

describe('validateAddress', () => {
	it('Should not error with a valid substrate address', () => {
		expect(
			validateAddress('5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG')
		).toEqual([true, undefined]);
	});
	it('Should error with a hex address', () => {
		expect(
			validateAddress(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b'
			)
		).toEqual([false, 'Invalid address, hex is not supported']);
	});
	it('Should error with a nonsense address', () => {
		expect(validateAddress('hello')).toEqual([
			false,
			'Invalid base58 character "l" (0x6c) at index 2',
		]);
	});
	it('Should error with an address with invalid decoded address checksum', () => {
		expect(
			validateAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU')
		).toEqual([false, 'Invalid decoded address checksum']);
	});
	it('Should error with an address missing some bytes', () => {
		expect(
			validateAddress('y9EMHt34JJo4rWLSaxoLGdYXvjgSXEd4zHUnQgfNzwES8b')
		).toEqual([false, 'Invalid address format']);
	});
});
