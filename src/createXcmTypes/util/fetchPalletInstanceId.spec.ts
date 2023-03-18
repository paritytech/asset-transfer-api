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

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstandId', () => {
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId(mockSystemApi);

		expect(res).toEqual('50');
	});
	it('Should error when there is no Asset pallet available', () => {
		const mockApi = {
			registry: {
				metadata: {
					pallets: [{ name: 'NotAssets' }],
				},
			},
		} as unknown as ApiPromise;
		const res = () => fetchPalletInstanceId(mockApi);

		expect(res).toThrowError(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	});
});
