// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi';
import { Direction, XcmDirection } from '../../types';
import { XcmPalletName } from '../util/establishXcmPallet';
import { transferMultiassetWithFee } from './transferMultiassetWithFee';

describe('transferMultiassetWithFee', () => {
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
		it('Should correctly construct an Unlimited transferMultiassetWithFee tx for V2', async () => {
			const isLimited = false;
			const refTime = undefined;
			const proofSize = undefined;
			const paysWithFeeDest =
				'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

			const ext = await transferMultiassetWithFee(baseArgs, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(ext.toHex()).toBe(
				'0x2d01046a030100010300a10f043205011f0002093d000100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00',
			);
		});
		it('Should correctly construct a Limited transferMultiassetWithFee tx for V2', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';
			const paysWithFeeDest =
				'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

			const ext = await transferMultiassetWithFee(baseArgs, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
				paysWithFeeDest,
				isForeignAssetsTransfer: false,
				isLiquidTokenTransfer: false,
			});

			expect(ext.toHex()).toBe(
				'0x3d01046a030100010300a10f043205011f0002093d000100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
			);
		});

		it('Should correctly construct an Unlimited transferMultiassetWithFee tx for V3', async () => {
			const isLimited = false;
			const refTime = undefined;
			const proofSize = undefined;
			const paysWithFeeDest =
				'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

			const ext = await transferMultiassetWithFee(
				{
					...baseArgs,
					assetIds: ['42259045809535163221576417993425387648'],
					amounts: ['10000000000'],
					xcmVersion: 3,
				},
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				},
			);

			expect(ext.toHex()).toBe(
				'0x1501046a0303000100000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00',
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V3', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';
			const paysWithFeeDest =
				'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

			const ext = await transferMultiassetWithFee(
				{
					...baseArgs,
					amounts: ['100'],
					xcmVersion: 3,
				},
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				},
			);

			expect(ext.toHex()).toBe(
				'0x3501046a030300010300a10f043205011f0091010300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
			);
		});
	});
});
