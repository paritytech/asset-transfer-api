// Copyright 2023 Parity Technologies (UK) Ltd.

import { specNameIsAssetHub } from "./specNameIsAssetHub";

describe('specNameIsAssetHub', () => {
    it('Should correctly return true when a given specName is a valid AssetHub specName', () => {
        type Test = [specName: string, expected: boolean];

        const tests: Test[] = [
            ['westmint', true],
            ['statemine', true],
            ['statemint', true],
            ['asset-hub-westend', true],
            ['asset-hub-kusama', true],
            ['asset-hub-polkadot', true]
        ];

        for (const test of tests) {
            const [specName, expected] = test;

            const result = specNameIsAssetHub(specName);

            expect(result).toEqual(expected);
        }
    });

    it('Should correctly return false when a given specName is not a valid AssetHub specName', () => {
        type Test = [specName: string, expected: boolean];

        const tests: Test[] = [
            ['westend', false],
            ['moonriver', false],
            ['astar', false],
            ['shiden', false],
            ['tinkernet_node', false],
            ['phala', false]
        ];

        for (const test of tests) {
            const [specName, expected] = test;

            const result = specNameIsAssetHub(specName);

            expect(result).toEqual(expected);
        }
    });
})