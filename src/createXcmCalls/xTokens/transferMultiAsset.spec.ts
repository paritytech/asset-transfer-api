// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry/index.js';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi.js';
import { Direction, XcmDirection } from '../../types.js';
import { XcmPalletName } from '../util/establishXcmPallet.js';
import { transferMultiasset } from './transferMultiasset.js';

describe('transferMultiasset', () => {
	describe('ParaToSystem', () => {
		const registry = new Registry('moonriver', {});
		const baseArgs = {
			api: adjustedMockMoonriverParachainApi,
			direction: Direction.ParaToSystem as XcmDirection,
			destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			assetIds: ['311091173110107856861649819128533077277'],
			amounts: ['1000000'],
			destChainId: '1000',
			xcmVersion: 2,
			specName: 'moonriver',
			registry,
			xcmPallet: XcmPalletName.xTokens,
		};
		it('Should correctly construct an Unlimited transferMultiasset tx for V2', async () => {
			const ext = await transferMultiasset(baseArgs, {
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(ext.toHex()).toBe(
				'0xf4046a010100010300a10f043205011f0002093d0001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00',
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V2', async () => {
			const ext = await transferMultiasset(baseArgs, {
				weightLimit: {
					refTime: '1000',
					proofSize: '2000',
				},
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(ext.toHex()).toBe(
				'0x0501046a010100010300a10f043205011f0002093d0001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
			);
		});

		it('Should correctly construct an Unlimited transferMultiasset tx for V3', async () => {
			const ext = await transferMultiasset(
				{ ...baseArgs, xcmVersion: 3, amounts: ['100'] },
				{
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				},
			);

			expect(ext.toHex()).toBe(
				'0xec046a010300010300a10f043205011f00910103010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00',
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V3', async () => {
			const ext = await transferMultiasset(
				{ ...baseArgs, xcmVersion: 3, assetIds: ['42259045809535163221576417993425387648'] },
				{
					weightLimit: {
						refTime: '1000',
						proofSize: '2000',
					},
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				},
			);

			expect(ext.toHex()).toBe(
				'0xe4046a01030001000002093d0003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
			);
		});
	});
});
