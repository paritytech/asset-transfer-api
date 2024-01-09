// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApi';
import { Direction, XcmDirection } from '../../types';
import { reserveTransferAssets } from './reserveTransferAssets';

describe('reserveTransferAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		const isLiquidTokenTransfer = false;
		const baseArgs = {
			api: adjustedMockSystemApi,
			direction: Direction.SystemToPara as XcmDirection,
			destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			assetIds: ['1'],
			amounts: ['100'],
			destChainId: '1000',
			xcmVersion: 2,
			specName: 'statemine',
			registry,
		};
		const FAbaseArgs = {
			...baseArgs,
			assetIds: ['{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
			destChainId: '2023',
		};
		it('Should correctly construct a tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;

			const ext = await reserveTransferAssets(baseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0xf8041f0201010100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000',
			);
		});
		it('Should error when a api does not support the required pallets', async () => {
			const mockApi = { tx: {} } as unknown as ApiPromise;
			const mockApiBaseArgs = { ...baseArgs, api: mockApi };
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;

			await expect(async () => {
				await reserveTransferAssets(mockApiBaseArgs, {
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				});
			}).rejects.toThrowError("Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API");
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;

			const ext = await reserveTransferAssets(FAbaseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0501041f02010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001030435003521050000910100000000',
			);
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V3 TEST', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const xcmVersionBaseArgs = { ...FAbaseArgs, xcmVersion: 3 };

			const ext = await reserveTransferAssets(xcmVersionBaseArgs, {
				paysWithFeeDest,
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
			});

			expect(ext.toHex()).toBe(
				'0x0501041f02030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001030435003521050000910100000000',
			);
		});
	});
});
