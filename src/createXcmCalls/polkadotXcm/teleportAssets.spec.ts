import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { Direction, XcmDirection } from '../../types';
import { teleportAssets } from './teleportAssets';

describe('teleportAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		const isLiquidTokenTransfer = false;
		const baseArgs = {
			api: mockSystemApi,
			direction: Direction.SystemToPara as XcmDirection,
			destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			assetIds: ['1'],
			amounts: ['100'],
			destChainId: '2004',
			xcmVersion: 2,
			specName: 'statemine',
			registry,
		};
		it('Should correctly construct a tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;

			const ext = await teleportAssets(baseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0xf8041f0101010100511f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000'
			);
		});
		it('Should error when a api does not support the required pallets', async () => {
			const mockApi = { tx: {} } as unknown as ApiPromise;
			const mockApiBaseArgs = { ...baseArgs, api: mockApi };
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;

			await expect(async () => {
				await teleportAssets(mockApiBaseArgs, {
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				});
			}).rejects.toThrowError("Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API");
		});
	});
});
