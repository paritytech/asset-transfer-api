// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from "../../registry";
import { isParachainPrimaryNativeAsset } from "./isParachainPrimaryNativeAsset";

describe('isParachainPrimaryNativeAsset', () => {
    type Test = [
            primaryNativeAssetSymbol: string, 
            specName: string, 
            registry: Registry,
            expected: boolean
        ];

    it('Should correctly return true for a parachains primary native asset', () => {
        const moonriverRegistry = new Registry('moonriver', {});
        const hydraDXRegistry = new Registry('hydradx', {});

        const tests: Test[] = [
            [
                'MOVR',
                'moonriver',
                moonriverRegistry,
                true
            ],
            [
                'HDX',
                'hydradx',
                hydraDXRegistry,
                true
            ]
        ];

        for (const test of tests) {
            const [primaryNativeAssetSymbol, specName, registry, expected] = test;

            const result = isParachainPrimaryNativeAsset(primaryNativeAssetSymbol, registry, specName);

            expect(result).toEqual(expected);
        }
    });

    it('Should correctly return false for non primary native parachain assets', () => {
        const moonriverRegistry = new Registry('moonriver', {});
        const bifrostRegistry = new Registry('bifrost_polkadot', {});

        const tests: Test[] = [
            [
                'xcUSDT',
                'moonriver',
                moonriverRegistry,
                false
            ],
            [
                'WETH',
                'bifrost_polkadot',
                bifrostRegistry,
                false
            ]
        ];

        for (const test of tests) {
            const [primaryNativeAssetSymbol, specName, registry, expected] = test;

            const result = isParachainPrimaryNativeAsset(primaryNativeAssetSymbol, registry, specName);

            expect(result).toEqual(expected);
        }
    });
});