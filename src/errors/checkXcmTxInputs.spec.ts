// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { Direction } from '../types';
import {
	checkAssetIdInput,
	checkAssetsAmountMatch,
	checkIfNativeRelayChainAssetPresentInMultiAssetIdList,
	checkRelayAmountsLength,
	checkRelayAssetIdLength,
} from './checkXcmTxInputs';

const runTests = (tests: Test[]) => {
	for (const test of tests) {
		const [destChainId, specName, testInputs, direction, errorMessage] = test;
		const registry = new Registry(specName, {});
		const currentRegistry = registry.currentRelayRegistry;

		const err = () =>
			checkAssetIdInput(
				testInputs,
				currentRegistry,
				specName,
				destChainId,
				direction,
				registry
			);
		expect(err).toThrow(errorMessage);
	}
};

describe('checkRelayAssetIdLength', () => {
	it('Should error with an incorrect assetId length for inputs to or from relay chains', () => {
		const err = () => checkRelayAssetIdLength(['dot', 'usdt']);

		expect(err).toThrow(
			"`assetIds` should be empty or length 1 when sending tx's to or from the relay chain."
		);
	});
});

describe('checkRelayAmountsLength', () => {
	it('Should error with an incorrect amounts length', () => {
		const err = () => checkRelayAmountsLength(['1000000000', '10000000000']);
		expect(err).toThrow(
			'`amounts` should be of length 1 when sending to or from a relay chain'
		);
	});
});

describe('checkAssetsAmountMatch', () => {
	it("Should error when inputted assetId's dont match amounts length", () => {
		const err = () => checkAssetsAmountMatch(['1'], ['10', '10']);

		expect(err).toThrow(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	});
});

type Test = [
	destChainId: string,
	specName: string,
	inputs: string[],
	xcmDirection: Direction,
	errorMessage: string
];

describe('checkAssetIds', () => {
	it('Should error when an assetId is found that is empty or a blank space', () => {
		const tests: Test[] = [
			[
				'1000',
				'Statemint',
				['', 'DOT'],
				Direction.RelayToSystem,
				`assetId cannot be blank spaces or empty. Found empty string`,
			],
			[
				'0',
				'Statemine',
				[' ', 'KSM'],
				Direction.SystemToRelay,
				`assetId cannot be blank spaces or empty. Found blank space`,
			],
		];

		runTests(tests);
	});

	it('Should error when direction is RelayToSystem and assetId does not match relay chains native token', () => {
		const tests: Test[] = [
			[
				'1000',
				'Polkadot',
				['1', 'DOT'],
				Direction.RelayToSystem,
				`Relay to System: asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'1000',
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToSystem,
				`Relay to System: asset DOT is not kusama's native asset. Expected KSM`,
			],
			[
				'1000',
				'Westend',
				['WND', '100000'],
				Direction.RelayToSystem,
				`Relay to System: asset 100000 is not westend's native asset. Expected WND`,
			],
		];

		runTests(tests);
	});

	it('Should error when direction is RelayToPara and assetId does not match relay chains native token', () => {
		const tests: Test[] = [
			[
				'2004',
				'Polkadot',
				['1', 'DOT'],
				Direction.RelayToPara,
				`Relay to Para: asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'2001',
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToPara,
				`Relay to Para: asset DOT is not kusama's native asset. Expected KSM`,
			],
		];

		runTests(tests);
	});

	it('Should error when direction is SystemToRelay and an assetId is not native to the relay chain', () => {
		const tests: Test[] = [
			[
				'0',
				'Statemint',
				['0'],
				Direction.SystemToRelay,
				`System to Relay: assetId 0 not native to polkadot`,
			],
			[
				'0',
				'Statemine',
				['MOVR', 'KSM'],
				Direction.SystemToRelay,
				`System to Relay: assetId MOVR not native to kusama`,
			],
			[
				'0',
				'Westmint',
				['WND', '250'],
				Direction.SystemToRelay,
				`System to Relay: assetId 250 not native to westend`,
			],
		];

		runTests(tests);
	});

	it('Should error when direction is SystemToPara and integer assetId is not found in system parachains assets', () => {
		const tests: Test[] = [
			[
				'2004',
				'Statemint',
				['1337', 'DOT', '3500000'],
				Direction.SystemToPara,
				`System to Para: integer assetId 3500000 not found in Statemint`,
			],
			[
				'2023',
				'Statemine',
				['KSM', '8', 'stateMineDoge'],
				Direction.SystemToPara,
				`System to Para: assetId stateMineDoge not found for system parachain Statemine`,
			],
			[
				'1002',
				'Westmint',
				['WND', '250'],
				Direction.SystemToPara,
				`System to Para: integer assetId 250 not found in Westmint`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction,
					registry
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when direction is SystemToPara and the string assetId is not found in the system parachains tokens or assets', () => {
		const tests: Test[] = [
			[
				'2004',
				'Statemint',
				['1337', 'xcDOT'],
				Direction.SystemToPara,
				`System to Para: assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'2023',
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToPara,
				`System to Para: assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'1002',
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToPara,
				`System to Para: assetId Test Westend not found for system parachain Westmint`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction,
					registry
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when an asset id is provided that matches multiple asset symbols in the assets registry', () => {
		const tests: Test[] = [
			[
				'2004',
				'Statemint',
				['btc'],
				Direction.SystemToPara,
				`Multiple assets found with symbol btc`,
			],
			[
				'2023',
				'Statemine',
				['USDT'],
				Direction.SystemToPara,
				`Multiple assets found with symbol USDT`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction,
					registry
				);
			expect(err).toThrowError(errorMessage);
		}
	});
});

describe('checkIfNativeRelayChainAssetPresentInMultiAssetIdList', () => {
	it('Should error when the relay native asset and system assets are in the same assetIds list when direction', () => {
		const expectErrorMessage =
			'Found the relay chains native asset in list ksm,usdc. assetIds list must be empty or only contain the relay chain asset for direction SystemToSystem';
		const assetIds = ['ksm', 'usdc'];
		const specName = 'statemine';
		const registry = new Registry(specName, {});

		const err = () =>
			checkIfNativeRelayChainAssetPresentInMultiAssetIdList(assetIds, registry);
		expect(err).toThrowError(expectErrorMessage);
	});
});
