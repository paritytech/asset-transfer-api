// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { Direction } from '../../types';
import { limitedReserveTransferAssets } from './limitedReserveTransferAssets';

describe('limitedReserveTransferAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		it('Should correctly construct a tx for a system parachain with V2', () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';

			const ext = limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				isLimited,
				refTime,
				proofSize
			);

			expect(ext.toHex()).toBe(
				'0xfc041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000002043205040091010000000000'
			);
		});
		it('Should correctly construct a tx for when a weightLimit is available', () => {
			const isLimited = true;
			const refTime = '1000000000';
			const proofSize = '2000';

			const ext = limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				isLimited,
				refTime,
				proofSize
			);

			expect(ext.toHex()).toBe(
				'0x0501041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000010000'
			);
		});
		it('Should error when a api does not support the required pallets', () => {
			const isLimited = true;
			const refTime = '1000000000';
			const proofSize = '2000';

			const mockApi = { tx: {} } as unknown as ApiPromise;
			const err = () =>
				limitedReserveTransferAssets(
					mockApi,
					Direction.SystemToPara,
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1'],
					['100'],
					'2023',
					2,
					'statemine',
					registry,
					isLimited,
					refTime,
					proofSize
				);

			expect(err).toThrowError(
				"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
			);
		});
	});
});
