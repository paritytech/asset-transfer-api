// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { Direction } from '../types';
import { limitedReserveTransferAssets } from './limitedReserveTransferAssets';

describe('limitedReserveTransferAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		const isLiquidTokenTransfer = false;
		it('Should correctly construct a tx for a system parachain with V2', async () => {
			const weightLimit = '1000000000';
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				{
					weightLimit,
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				}
			);

			expect(ext.toHex()).toBe(
				'0x0501041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000010000'
			);
		});
		it('Should correctly construct a tx for when a weightLimit is available', async () => {
			const weightLimit = '1000000000';
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;
			const ext = await limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				{
					weightLimit,
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				}
			);

			expect(ext.toHex()).toBe(
				'0x0501041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000010000'
			);
		});

		it('Should error when a api does not support the required pallets', async () => {
			const mockApi = { tx: {} } as unknown as ApiPromise;
			const weightLimit = undefined;
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			await expect(async () => {
				await limitedReserveTransferAssets(
					mockApi,
					Direction.SystemToPara,
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1'],
					['100'],
					'2023',
					2,
					'statemine',
					registry,
					{
						weightLimit,
						paysWithFeeDest,
						isLiquidTokenTransfer,
						isForeignAssetsTransfer,
					}
				);
			}).rejects.toThrowError(
				"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
			);
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V2', async () => {
			const weightLimit = undefined;
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				[
					'{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
				],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				{
					weightLimit,
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				}
			);

			expect(ext.toHex()).toBe(
				'0x0901041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000103043500352105000091010000000000'
			);
		});

		it('Should correctly construct a foreign asset tx for when a weightLimit is available', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;
			const ext = await limitedReserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				[
					'{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
				],
				['100'],
				'2023',
				2,
				'statemine',
				registry,
				{
					weightLimit: '1000000000',
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
				}
			);

			expect(ext.toHex()).toBe(
				'0x1101041f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001030435003521050000910100000000010000'
			);
		});
	});
});
