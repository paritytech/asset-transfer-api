import { findRelayChain } from '../registry/findRelayChain';
import { parseRegistry } from '../registry/parseRegistry';
import { Direction } from '../types';
import { checkAssetIdInput, checkXcmTxInputs } from './checkXcmTxInputs';

describe('checkXcmTxinputs', () => {
	it("Should error when inputted assetId's dont match amounts length", () => {
		const err = () =>
			checkXcmTxInputs(
				['1'],
				['10', '10'],
				Direction.SystemToPara,
				'0',
				'Statemint',
				parseRegistry({})
			);

		expect(err).toThrow(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	});
	it('Should error when inputting assetIds when a transactions origin is the relay chain', () => {
		const err = () =>
			checkXcmTxInputs(
				['DOT'],
				['1000'],
				Direction.RelayToSystem,
				'1000',
				'Polkadot',
				parseRegistry({})
			);

		expect(err).toThrow(
			"`assetIds` should be empty when sending tx's from the relay chain."
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
		const registry = parseRegistry({});

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

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when direction is RelayToSystem and assetId does not match relay chains native token', () => {
		const registry = parseRegistry({});

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

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction
				);
			expect(err).toThrow(errorMessage);
		}
	});
	it('Should error when direction is SystemToRelay and an assetId is not native to the relay chain', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'0',
				'Statemint',
				['0'],
				Direction.SystemToRelay,
				`assetId 0 not native to polkadot`,
			],
			[
				'0',
				'Statemine',
				['MOVR', 'KSM'],
				Direction.SystemToRelay,
				`assetId MOVR not native to kusama`,
			],
			[
				'0',
				'Westmint',
				['WND', '250'],
				Direction.SystemToRelay,
				`assetId 250 not native to westend`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when direction is SystemToPara and integer assetId is not found in system parachains assets', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2004',
				'Statemint',
				['1337', 'DOT', '3500000'],
				Direction.SystemToPara,
				`integer assetId 3500000 not found in Statemint`,
			],
			[
				'2023',
				'Statemine',
				['KSM', '8', 'stateMineDoge'],
				Direction.SystemToPara,
				`assetId stateMineDoge not found for system parachain Statemine`,
			],
			[
				'1002',
				'Westmint',
				['WND', '250'],
				Direction.SystemToPara,
				`integer assetId 250 not found in Westmint`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when direction is SystemToPara and the string assetId is not found in the system parachains tokens or assets', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2004',
				'Statemint',
				['1337', 'xcDOT'],
				Direction.SystemToPara,
				`assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'2023',
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToPara,
				`assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'1002',
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToPara,
				`assetId Test Westend not found for system parachain Westmint`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, direction, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					direction
				);
			expect(err).toThrow(errorMessage);
		}
	});

	// TODO:
	// it('Should error when direction is ParaToRelay and the string assetId is not the relay chains native asset', () => {

	// });

	// TODO:
	// it('Should error when direction is ParaToPara and the string assetId is not found in the origin chains assets', () => {

	// });
});
