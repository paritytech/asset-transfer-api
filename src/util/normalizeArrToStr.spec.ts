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

import { normalizeArrToStr } from './normalizeArrToStr';

describe('normalizeAccounts', () => {
	it('Should handle an array with both strings and numbers', () => {
		const vals = ['100', 100];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});

	it('Should handle just string correctly', () => {
		const vals = ['100', '100'];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});

	it('Should handle just numbers correctly', () => {
		const vals = [100, 100];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});
});
