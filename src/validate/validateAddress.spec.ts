// Copyright 2017-2023 Parity Technologies (UK) Ltd.
// This file is part of @substrate/asset-transfer-api.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
