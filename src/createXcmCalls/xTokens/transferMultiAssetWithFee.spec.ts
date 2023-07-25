// Copyright 2023 Parity Technologies (UK) Ltd.

import { transferMultiAssetWithFee } from './transferMultiAssetWithFee';
import { mockParachainApi } from '../../testHelpers/mockParachainApi';
import { Direction } from '../../types';
import { Registry } from '../../registry';

describe('transferMultiAssetWithFee', () => {
    describe('ParaToSystem', () => {
        const registry = new Registry('moonriver', {});

        it('Should correctly construct an Unlimited transferMultiassetWithFee tx for V2', () => {
            const isLimited = false;
            const refTime = undefined;
            const proofSize = undefined;
            const paysWithFeeDest = '{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

            const ext = transferMultiAssetWithFee(
                mockParachainApi,
                Direction.ParaToSystem,
                '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
                ['1'],
                ['100'],
                2,
                'moonriver',
                registry,
                isLimited,
                refTime,
                proofSize,
                paysWithFeeDest
            );
    
            expect(ext.toHex()).toBe(
                '0x1501046a030100010300a10f043205040091010100010300a10f043205040091010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
            );
        });
        it('Should correctly construct a Limited transferMultiassetWithFee tx for V2', () => {
            const isLimited = true;
            const refTime = '1000';
            const proofSize = '2000';
            const paysWithFeeDest = '{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

            const ext = transferMultiAssetWithFee(
                mockParachainApi,
                Direction.ParaToSystem,
                '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
                ['1'],
                ['100'],
                2,
                'moonriver',
                registry,
                isLimited,
                refTime,
                proofSize,
                paysWithFeeDest
            );
    
            expect(ext.toHex()).toBe(
                '0x2501046a030100010300a10f043205040091010100010300a10f043205040091010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
            );
        });

        it('Should correctly construct an Unlimited transferMultiassetWithFee tx for V3', () => {
            const isLimited = false;
            const refTime = undefined;
            const proofSize = undefined;
            const paysWithFeeDest = '{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

            const ext = transferMultiAssetWithFee(
                mockParachainApi,
                Direction.ParaToSystem,
                '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
                ['1'],
                ['100'],
                3,
                'moonriver',
                registry,
                isLimited,
                refTime,
                proofSize,
                paysWithFeeDest
            );
    
            expect(ext.toHex()).toBe(
                '0x1501046a030300010300a10f043205040091010300010300a10f043205040091010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b00'
            );
        });
        it('Should correctly construct a Limited transferMultiasset tx for V3', () => {
            const isLimited = true;
            const refTime = '1000';
            const proofSize = '2000';
            const paysWithFeeDest = '{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}';

            const ext = transferMultiAssetWithFee(
                mockParachainApi,
                Direction.ParaToSystem,
                '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
                ['1'],
                ['100'],
                3,
                'moonriver',
                registry,
                isLimited,
                refTime,
                proofSize,
                paysWithFeeDest
            );
    
            expect(ext.toHex()).toBe(
                '0x2501046a030300010300a10f043205040091010300010300a10f043205040091010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
            );
        });
    })
});