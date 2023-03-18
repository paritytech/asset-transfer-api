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

import { mockRelayApi } from '../testHelpers/mockRelayApi';
import { RelayToPara } from './RelayToPara';

describe('XcmVersionedMultiLocation Generation', () => {
	describe('Beneficiary', () => {
		it('Should work for V0', () => {
			const beneficiary = RelayToPara.createBeneficiary(
				mockRelayApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				0
			);

			const expectedRes = {
				v0: {
					x1: {
						accountId32: {
							id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							network: {
								any: null,
							},
						},
					},
				},
			};

			expect(beneficiary.toJSON()).toStrictEqual(expectedRes);
		});

		it('Should work for V1', () => {
			const beneficiary = RelayToPara.createBeneficiary(
				mockRelayApi,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				1
			);

			const expectedRes = {
				v1: {
					parents: 0,
					interior: {
						x1: {
							accountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
								network: {
									any: null,
								},
							},
						},
					},
				},
			};

			expect(beneficiary.toJSON()).toStrictEqual(expectedRes);
		});
	});

	describe('Destination', () => {
		it('Should work for V0', () => {
			const destination = RelayToPara.createDest(mockRelayApi, '100', 0);

			const expectedRes = {
				v0: {
					x1: {
						parachain: 100,
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});

		it('Should work for V1', () => {
			const destination = RelayToPara.createDest(mockRelayApi, '100', 1);

			const expectedRes = {
				v1: {
					parents: 0,
					interior: {
						x1: {
							parachain: 100,
						},
					},
				},
			};

			expect(destination.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		it('Should work for V0', () => {
			const assets = RelayToPara.createAssets(mockRelayApi, ['100'], 0);

			const expectedRes = {
				v0: [
					{
						concreteFungible: {
							amount: 100,
							id: {
								null: null,
							},
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should work for V1', () => {
			const assets = RelayToPara.createAssets(mockRelayApi, ['100'], 1);

			const expectedRes = {
				v1: [
					{
						fun: {
							fungible: 100,
						},
						id: {
							concrete: {
								interior: {
									here: null,
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('WeightLimit', () => {
		// NOTE: for V0, V1, and V2 Weightlimit just uses V2 so we only need to test once.
		// No matter the version if its equal to or less than 2, it will alwyas default to V2.
		it('Should work when given a weightLimit', () => {
			const weightLimit = RelayToPara.createWeightLimit(
				mockRelayApi,
				'100000000'
			);
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: 100000000,
			});
		});
		it('Should work when no weightLimit is present', () => {
			const weightLimit = RelayToPara.createWeightLimit(mockRelayApi);

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});
});
