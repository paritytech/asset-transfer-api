import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { Direction, XcmDirection } from '../../types';
import { limitedReserveTransferAssets } from './limitedReserveTransferAssets';

describe('limitedReserveTransferAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		const isLiquidTokenTransfer = false;
		const baseArgs = {
			api: adjustedMockSystemApi,
			direction: Direction.SystemToPara as XcmDirection,
			destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			assetIds: ['1'],
			amounts: ['100'],
			destChainId: '2023',
			xcmVersion: 2,
			specName: 'statemine',
			registry,
		};
		const FAbaseArgs = {
			...baseArgs,
			assetIds: ['{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
		};
		it('Should correctly construct a tx for a system parachain with V2', async () => {
			const refTime = '1000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await limitedReserveTransferAssets(baseArgs, {
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0d01041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000002043205040091010000000001a10f411f',
			);
		});
		it('Should correctly construct a tx for when a weightLimit is available', async () => {
			const refTime = '1000000000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await limitedReserveTransferAssets(baseArgs, {
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x1501041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400000204320504009101000000000102286bee411f',
			);
		});

		it('Should error when a api does not support the required pallets', async () => {
			const refTime = '1000000000';
			const proofSize = '2000';

			const mockApi = { tx: {} } as unknown as ApiPromise;
			const mockApiBaseArgs = { ...baseArgs, api: mockApi };
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			await expect(async () => {
				await limitedReserveTransferAssets(mockApiBaseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				});
			}).rejects.toThrow(
				'No supported pallet found in the current runtime. Supported pallets are xcmPallet, polkadotXcm, xTokens.',
			);
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await limitedReserveTransferAssets(FAbaseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0101041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000000',
			);
		});

		it('Should correctly construct a foreign asset tx for when a weightLimit is available', async () => {
			const refTime = '1000000000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await limitedReserveTransferAssets(FAbaseArgs, {
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x1901041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001020035210500009101000000000102286bee411f',
			);
		});
	});
});
