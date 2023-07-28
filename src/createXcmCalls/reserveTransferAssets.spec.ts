// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { Direction } from '../types';
import { reserveTransferAssets } from './reserveTransferAssets';

describe('reserveTransferAssets', () => {
	const registry = new Registry('statemine', {});
	describe('SystemToPara', () => {
		it('Should correctly construct a tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;

			const ext = await reserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				2,
				'statemine',
				registry,
				paysWithFeeDest,
				isForeignAssetsTransfer
			);

			expect(ext.toHex()).toBe(
				'0xf8041f0201010100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000020432050400910100000000'
			);
		});
		it('Should error when a api does not support the required pallets', async () => {
			const mockApi = { tx: {} } as unknown as ApiPromise;
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = false;

			await expect(async () => {
				await reserveTransferAssets(
					mockApi,
					Direction.SystemToPara,
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1'],
					['100'],
					'1000',
					2,
					'statemine',
					registry,
					paysWithFeeDest,
					isForeignAssetsTransfer
				);
			}).rejects.toThrowError(
				"Can't find the `polkadotXcm` or `xcmPallet` pallet with the given API"
			);
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V2', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;

			const ext = await reserveTransferAssets(
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
				paysWithFeeDest,
				isForeignAssetsTransfer
			);

			expect(ext.toHex()).toBe(
				'0x0501041f02010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001030435003521050000910100000000'
			);
		});

		it('Should correctly construct a foreign asset tx for a system parachain with V3', async () => {
			const paysWithFeeDest = undefined;
			const isForeignAssetsTransfer = true;

			const ext = await reserveTransferAssets(
				mockSystemApi,
				Direction.SystemToPara,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				[
					'{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
				],
				['100'],
				'2023',
				3,
				'statemine',
				registry,
				paysWithFeeDest,
				isForeignAssetsTransfer
			);

			expect(ext.toHex()).toBe(
				'0x0501041f02030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001030435003521050000910100000000'
			);
		});
	});
});
