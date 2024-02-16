// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1007000';
import { Direction, XcmBaseArgs, XcmDirection } from '../../types';
import { transferAssets } from './transferAssets';

describe('transferAssets', () => {
	const registry = new Registry('westmint', {});

	describe('SystemToPara', () => {
		const isLiquidTokenTransfer = false;
		const baseArgs: XcmBaseArgs = {
			api: adjustedMockSystemApi,
			direction: Direction.SystemToPara as XcmDirection,
			destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			assetIds: ['1'],
			amounts: ['100'],
			destChainId: '2023',
			xcmVersion: 4,
			specName: 'westmint',
			registry,
		};
		const FAbaseArgs = {
			...baseArgs,
			assetIds: ['{"parents":"1","interior":{ "X2":[{"Parachain":"1103"},{"GeneralIndex":"0"}]}}'],
		};
		it('Should correctly construct a tx for a system parachain with V4', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await transferAssets(baseArgs, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0d01041f0b030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000002043205040091010000000001a10f411f',
			);
		});
		it('Should correctly construct a tx when a weightLimit is available', async () => {
			const isLimited = true;
			const refTime = '1000000000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await transferAssets(baseArgs, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x1501041f0b030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400000204320504009101000000000102286bee411f',
			);
		});

		it('Should error when a api does not support the required pallets', async () => {
			const isLimited = true;
			const refTime = '1000000000';
			const proofSize = '2000';

			const mockApi = { tx: {} } as unknown as ApiPromise;
			const mockApiBaseArgs = { ...baseArgs, api: mockApi };
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			await expect(async () => {
				await transferAssets(mockApiBaseArgs, {
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				});
			}).rejects.toThrow("Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API");
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V4', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await transferAssets(FAbaseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0901041f0b030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001030435003d1105000091010000000000',
			);
		});

		it('Should correctly construct a foreign asset tx when a weightLimit is available', async () => {
			const isLimited = true;
			const refTime = '1000000000';
			const proofSize = '2000';

			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await transferAssets(FAbaseArgs, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x2101041f0b030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001030435003d110500009101000000000102286bee411f',
			);
		});
	});
});
