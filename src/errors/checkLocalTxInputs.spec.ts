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

import { checkLocalTxInput } from './checkLocalTxInputs';

describe('checkLocalTxInput', () => {
	it('Should correctly throw an error when the address is hex', () => {
		const err = () => checkLocalTxInput('0x00', ['1'], ['1']);
		expect(err).toThrowError('Invalid address, hex is not supported');
	});
	it('Should correctly throw the error `Invalid decoded address checksum`', () => {
		const err = () =>
			checkLocalTxInput(
				'5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU',
				['1'],
				['1']
			);
		expect(err).toThrowError('Invalid decoded address checksum');
	});
	it('Should correctly throw an error for incorrect length on `assetds`', () => {
		const err = () =>
			checkLocalTxInput(
				'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
				['1', '2'],
				['1']
			);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error for incorrect length on `assetds`', () => {
		const err = () =>
			checkLocalTxInput(
				'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
				['1'],
				['1', '2']
			);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
});
