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
	errorMessage: string
];

describe('checkAssetIds', () => {
	it("Should error when inputted assetId's are not valid integer numbers or valid token symbols", () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'1000',
				'Statemint',
				['1', '2', '3', 'hello'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: hello`,
			],
			[
				'2004',
				'Moonbeam',
				['two', 'GLMR'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: two`,
			],
			[
				'2030',
				'Bifrost_Polkadot',
				['BNCC'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: BNCC`,
			],
			[
				'2104',
				'Manta',
				['', 'MANTA'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: `,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					Direction.SystemToPara
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it("Should error when assetId's includes a foreign chains asset", () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2006',
				'Astar',
				['ASTR', 'DOT'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: DOT`,
			],
			[
				'2004',
				'Moonbeam',
				['GLMR', 'BNC'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: BNC`,
			],
			[
				'2000',
				'Acala',
				['ACA', 'GLMR'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: GLMR`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					Direction.SystemToPara
				);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when the given integer asset id is not found in system parachain asset ids', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'1000',
				'Statemine',
				['11250986484', 'KSM'],
				`assetId 11250986484 not found in Statemine`,
			],
			[
				'1000',
				'Statemint',
				['28250986484', 'DOT'],
				`assetId 28250986484 not found in Statemint`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					Direction.SystemToPara
				);
			expect(err).toThrow(errorMessage);
		}
	});
	it('Should error when integer assetId is found for non system parachain origin', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2004',
				'Moonbeam',
				['2', 'GLMR'],
				`integer assetId's can only be used for transfers from system parachains. Expected a valid token symbol. Got 2`,
			],
			[
				'2012',
				'Parallel',
				['1', 'PARA'],
				`integer assetId's can only be used for transfers from system parachains. Expected a valid token symbol. Got 1`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(
					testInputs,
					currentRegistry,
					specName,
					destChainId,
					Direction.ParaToPara
				);
			expect(err).toThrow(errorMessage);
		}
	});
});
