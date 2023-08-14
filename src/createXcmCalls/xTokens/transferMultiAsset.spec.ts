// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { mockParachainApi } from '../../testHelpers/mockParachainApi';
import { Direction } from '../../types';
import { XcmPalletName } from '../util/establishXcmPallet';
import { transferMultiAsset } from './transferMultiAsset';

describe('transferMultiAsset', () => {
	describe('ParaToSystem', () => {
		const registry = new Registry('moonriver', {});

		it('Should correctly construct an Unlimited transferMultiasset tx for V2', async () => {
			const ext = await transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['311091173110107856861649819128533077277'],
				['1000000'],
				'1000',
				2,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0xf4046a010100010300a10f043205011f0002093d0001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V2', async () => {
			const ext = await transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['311091173110107856861649819128533077277'],
				['1000000'],
				'1000',
				2,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited: true,
					refTime: '1000',
					proofSize: '2000',
				}
			);

			expect(ext.toHex()).toBe(
				'0x0501046a010100010300a10f043205011f0002093d0001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});

		it('Should correctly construct an Unlimited transferMultiasset tx for V3', async () => {
			const ext = await transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['311091173110107856861649819128533077277'],
				['100'],
				'1000',
				3,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0xec046a010300010300a10f043205011f00910103010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V3', async () => {
			const ext = await transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['42259045809535163221576417993425387648'],
				['1000000'],
				'1000',
				3,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited: true,
					refTime: '1000',
					proofSize: '2000',
				}
			);

			expect(ext.toHex()).toBe(
				'0xe4046a01030001000002093d0003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});
	});
});
