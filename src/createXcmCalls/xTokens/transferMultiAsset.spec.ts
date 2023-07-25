// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { mockParachainApi } from '../../testHelpers/mockParachainApi';
import { Direction } from '../../types';
import { transferMultiAsset } from './transferMultiAsset';

describe('transferMultiAsset', () => {
	describe('ParaToSystem', () => {
		const registry = new Registry('moonriver', {});

		it('Should correctly construct an Unlimited transferMultiasset tx for V2', () => {
			const ext = transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				2,
				'moonriver',
				registry
			);

			expect(ext.toHex()).toBe(
				'0xdc046a010100010300a10f043205040091010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V2', () => {
			const ext = transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				2,
				'moonriver',
				registry,
				true,
				'1000',
				'2000'
			);

			expect(ext.toHex()).toBe(
				'0xec046a010100010300a10f043205040091010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});

		it('Should correctly construct an Unlimited transferMultiasset tx for V3', () => {
			const ext = transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				3,
				'moonriver',
				registry
			);

			expect(ext.toHex()).toBe(
				'0xdc046a010300010300a10f043205040091010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
			);
		});
		it('Should correctly construct a Limited transferMultiasset tx for V3', () => {
			const ext = transferMultiAsset(
				mockParachainApi,
				Direction.ParaToSystem,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1'],
				['100'],
				3,
				'moonriver',
				registry,
				true,
				'1000',
				'2000'
			);

			expect(ext.toHex()).toBe(
				'0xec046a010300010300a10f043205040091010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
			);
		});
	});
});
