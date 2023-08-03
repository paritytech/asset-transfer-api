// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { mockParachainApi } from '../../testHelpers/mockParachainApi';
import { Direction } from '../../types';
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
				['1'],
				['100'],
				'1000',
				2,
				'moonriver',
				registry,
				{
					isLimited,
					refTime,
					proofSize,
				},
				paysWithFeeDest
			);

			expect(ext.toHex()).toBe(
				'0xfc046a05010400010300a10f043205040091010000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
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
				['1'],
				['100'],
				'1000',
				2,
				'moonriver',
				registry,
				{
					isLimited,
					refTime,
					proofSize,
				},
				paysWithFeeDest
			);

			expect(ext.toHex()).toBe(
				'0x0d01046a05010400010300a10f043205040091010000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});

		it('Should correctly construct an Unlimited transferMultiAssets tx for V3', async () => {
			const isLimited = false;
			const refTime = undefined;
			const proofSize = undefined;
			const paysWithFeeDest = '0';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				3,
				'moonriver',
				registry,
				{
					isLimited,
					refTime,
					proofSize,
				},
				paysWithFeeDest
			);

			expect(ext.toHex()).toBe(
				'0xfc046a05030400010300a10f043205040091010000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V3', async () => {
			const isLimited = true;
			const refTime = '1000';
			const proofSize = '2000';
			const paysWithFeeDest = '0';

			const ext = await transferMultiAssets(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				'1000',
				3,
				'moonriver',
				registry,
				{
					isLimited,
					refTime,
					proofSize,
				},
				paysWithFeeDest
			);

			expect(ext.toHex()).toBe(
				'0x0d01046a05030400010300a10f043205040091010000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});
	});
});
