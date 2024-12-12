// Copyright 2023 Parity Technologies (UK) Ltd.

import { multiLocationAssetIsParachainsNativeAsset } from './multiLocationAssetIsParachainsNativeAsset';

describe('multiLocationAssetIsParachainsNativeAsset', () => {
	type Test = [destChainId: string, multiLocationAssetId: string, expected: boolean];

	it('Should correctly return true when a foreign assets multilocation matches its native chain of origin', () => {
		const tests: Test[] = [
			['2023', '{"parents":"1","interior":{"X1": {"Parachain":"2023"}}}', true],
			['2125', '{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}', true],
			[
				'2006',
				'{"parents":"1","interior":{"X3":[{"Parachain":"2006"},{"PalletInstance": "50"},{"GeneralIndex":"10"}]}}',
				true,
			],
		];

		for (const test of tests) {
			const [destChainId, multiLocationAssetId, expected] = test;
			const isNativeChain = multiLocationAssetIsParachainsNativeAsset(destChainId, multiLocationAssetId);

			expect(isNativeChain).toEqual(expected);
		}
	});

	it('Should correctly return false when a foreign assets multilocation does not match the destination chain', () => {
		const tests: Test[] = [
			['2023', '{"parents":"1","interior":{"X1": {"Parachain":"2000"}}}', false],
			['2004', '{"parents":"1","interior":{"X2":[{"Parachain":"2006"},{"GeneralIndex":"0"}]}}', false],
			[
				'2030',
				'{"parents":"1","interior":{"X3":[{"Parachain":"2006"},{"PalletInstance": "50"},{"GeneralIndex":"10"}]}}',
				false,
			],
		];

		for (const test of tests) {
			const [destChainId, multiLocationAssetId, expected] = test;
			const isNativeChain = multiLocationAssetIsParachainsNativeAsset(destChainId, multiLocationAssetId);

			expect(isNativeChain).toEqual(expected);
		}
	});
});
