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

import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { transfer } from './transfer';

describe('transfer', () => {
	it('Should construct a valid transfer extrinsic', () => {
		const res = transfer(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			'1',
			'10000'
		);
		expect(res.toHex()).toEqual(
			'0x9c0432080400f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b419c'
		);
	});
});
