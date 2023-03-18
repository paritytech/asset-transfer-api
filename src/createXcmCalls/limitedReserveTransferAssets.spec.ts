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

import type { ApiPromise } from '@polkadot/api';

import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { IDirection } from '../types';
import { limitedReserveTransferAssets } from './limitedReserveTransferAssets';

describe('limitedReserveTransferAssets', () => {
	describe('SystemToPara', () => {
		it('Should correctly construct a tx for a system parachain with V0', () => {
			const ext = limitedReserveTransferAssets(
				mockSystemApi,
				IDirection.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				0
			);

			expect(ext.toHex()).toBe(
				'0xec041f0800010200f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b000101a10f00040a020532060491010000000000'
			);
		});
		it('Should correctly construct a tx for a system parachain with V1', () => {
			const ext = limitedReserveTransferAssets(
				mockSystemApi,
				IDirection.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				1
			);

			expect(ext.toHex()).toBe(
				'0xfc041f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000'
			);
		});
		it('Should correctly construct a tx for when a weightLimit is available', () => {
			const ext = limitedReserveTransferAssets(
				mockSystemApi,
				IDirection.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				1,
				'1000000000'
			);

			expect(ext.toHex()).toBe(
				'0x0d01041f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f010400000204320504009101000000000102286bee'
			);
		});
		it('Should error when a api does not support the required pallets', () => {
			const mockApi = { tx: {} } as unknown as ApiPromise;
			const err = () =>
				limitedReserveTransferAssets(
					mockApi,
					IDirection.SystemToPara,
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1'],
					['100'],
					'1000',
					1
				);

			expect(err).toThrowError(
				"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
			);
		});
	});
});
