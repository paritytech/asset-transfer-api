// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry/index.js';
import { Direction } from '../../types.js';
import { isParachainPrimaryNativeAsset } from './isParachainPrimaryNativeAsset.js';

describe('isParachainPrimaryNativeAsset', () => {
	type Test = [primaryNativeAssetSymbol: string | undefined, specName: string, registry: Registry, expected: boolean];

	it('Should correctly return true for valid parachain primary asset inputs', () => {
		const moonriverRegistry = new Registry('moonriver', {});
		const hydraDXRegistry = new Registry('hydradx', {});

		const tests: Test[] = [
			['', 'moonriver', moonriverRegistry, true],
			['MOVR', 'moonriver', moonriverRegistry, true],
			[undefined, 'hydradx', hydraDXRegistry, true],
			['HDX', 'hydradx', hydraDXRegistry, true],
		];

		for (const test of tests) {
			const [primaryNativeAssetSymbol, specName, registry, expected] = test;
			const result = isParachainPrimaryNativeAsset(
				registry,
				specName,
				Direction.ParaToSystem,
				primaryNativeAssetSymbol,
			);

			expect(result).toEqual(expected);
		}
	});

	it('Should correctly return false for invalid primary native parachain asset inputs', () => {
		const moonriverRegistry = new Registry('moonriver', {});
		const bifrostRegistry = new Registry('bifrost_polkadot', {});

		const tests: Test[] = [
			['1', 'moonriver', moonriverRegistry, false],
			['0x9082099149', 'bifrost_polkadot', bifrostRegistry, false],
			['xcUSDT', 'moonriver', moonriverRegistry, false],
			['WETH', 'bifrost_polkadot', bifrostRegistry, false],
		];

		for (const test of tests) {
			const [primaryNativeAssetSymbol, specName, registry, expected] = test;

			const result = isParachainPrimaryNativeAsset(
				registry,
				specName,
				Direction.ParaToSystem,
				primaryNativeAssetSymbol,
			);

			expect(result).toEqual(expected);
		}
	});

	it('Should correctly return false when direction is not ParaToSystem', () => {
		const moonriverRegistry = new Registry('moonriver', {});
		const hydraDXRegistry = new Registry('hydradx', {});

		const tests: Test[] = [
			['MOVR', 'moonriver', moonriverRegistry, false],
			['HDX', 'hydradx', hydraDXRegistry, false],
		];

		for (const test of tests) {
			const [primaryNativeAssetSymbol, specName, registry, expected] = test;

			const result = isParachainPrimaryNativeAsset(
				registry,
				specName,
				Direction.SystemToPara,
				primaryNativeAssetSymbol,
			);

			expect(result).toEqual(expected);
		}
	});
});
