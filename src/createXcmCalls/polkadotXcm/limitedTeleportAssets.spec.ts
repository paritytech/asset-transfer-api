import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { Direction } from '../../types';
import { limitedTeleportAssets } from './limitedTeleportAssets';

describe('limitedTeleportAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		it('Should correctly construct a tx for a system parachain with V2', () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';

			const ext = limitedTeleportAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				2,
				'statemine',
				registry,
				isLimited,
				refTime,
				proofSize
			);

			expect(ext.toHex()).toBe(
				'0xfc041f0901010100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000002043205040091010000000000'
			);
		});
		it('Should error when a api does not support the required pallets', () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';

			const mockApi = { tx: {} } as unknown as ApiPromise;
			const err = () =>
				limitedTeleportAssets(
					mockApi,
					Direction.SystemToPara,
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1'],
					['100'],
					'1000',
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
