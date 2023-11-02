// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { mockParachainApi } from '../../testHelpers/mockParachainApi';
import { Direction } from '../../types';
import { XcmPalletName } from '../util/establishXcmPallet';
import { transferMultiAssets } from './transferMultiAssets';

describe('transferMultiAssets', () => {
	describe('ParaToSystem', () => {
		const registry = new Registry('moonriver', {});

		it('Should correctly construct an Unlimited transferMultiAssets tx for V2', async () => {
			const isLimited = false;
			const refTime = undefined;
			const proofSize = undefined;
			const paysWithFeeDest = '0';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['42259045809535163221576417993425387648', '182365888117048807484804376330534607370'],
				['10000000000', '25000000000'],
				'1000',
				2,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0x3501046a050108000100000700e40b540200010300a10f04320520000700ba1dd2050000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);

			expect(true).toBe(true);
		});
		it('Should correctly construct a Limited transferMultiAssets tx for V2', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';
			const paysWithFeeDest = '0';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['182365888117048807484804376330534607370', '311091173110107856861649819128533077277'],
				['1000000', '50000000000'],
				'1000',
				2,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0x5d01046a05010800010300a10f043205200002093d0000010300a10f043205011f000700743ba40b0000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});

		it('Should correctly construct an Unlimited transferMultiAssets tx for V3', async () => {
			const isLimited = false;
			const refTime = undefined;
			const proofSize = undefined;
			const paysWithFeeDest = '1';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['42259045809535163221576417993425387648', '311091173110107856861649819128533077277'],
				['20000000000', '1000000'],
				'1000',
				3,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0x3101046a050308000100000700c817a80400010300a10f043205011f0002093d000100000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiassets tx for V3', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';
			const paysWithFeeDest = '0';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['311091173110107856861649819128533077277'],
				['1000000'],
				'1000',
				3,
				'moonriver',
				registry,
				XcmPalletName.xTokens,
				{
					isLimited,
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isForeignAssetsTransfer: false,
					isLiquidTokenTransfer: false,
				}
			);

			expect(ext.toHex()).toBe(
				'0x1901046a05030400010300a10f043205011f0002093d000000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});
	});
});
