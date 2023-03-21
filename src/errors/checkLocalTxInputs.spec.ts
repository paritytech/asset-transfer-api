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
	it('Should correctly throw an error for incorrect length on `assetIds`', () => {
		const err = () => checkLocalTxInput(['1', '2'], ['10000']);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error for incorrect length on `amounts`', () => {
		const err = () => checkLocalTxInput(['1'], ['10000', '20000']);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
});
