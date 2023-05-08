import { findRelayChain } from '../registry/findRelayChain';
import { parseRegistry } from '../registry/parseRegistry';
import { IDirection } from '../types';
import { checkAssetIdInput, checkXcmTxInputs } from './checkXcmTxInputs';

describe('checkXcmTxinputs', () => {
	it("Should error when inputted assetId's dont match amounts length", () => {
		const err = () =>
			checkXcmTxInputs(
				['1000'],
				['10', '10'],
				IDirection.SystemToPara,
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
				IDirection.RelayToSystem,
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
				'0',
				'Polkadot',
				['DOT', 'hello', '2', 'DOT'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: hello`,
			],
			[
				'2004',
				'Moonbeam',
				['1', 'two', 'GLMR'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: two`,
			],
			[
				'2030',
				'Bifrost_Polkadot',
				['BNCC', '1', '2', '3', '4'],
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
				checkAssetIdInput(testInputs, currentRegistry, specName, destChainId);
			expect(err).toThrow(errorMessage);
		}
	});

	it("Should error when assetId's includes a foreign chains asset", () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2006',
				'Astar',
				['1', '2', '3', 'ASTR', 'DOT'],
				`'assetIds' must be either valid integer numbers or valid chain token symbols. Got: DOT`,
			],
			[
				'2004',
				'Moonbeam',
				['1', '2', '3', 'GLMR', 'BNC'],
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
				checkAssetIdInput(testInputs, currentRegistry, specName, destChainId);
			expect(err).toThrow(errorMessage);
		}
	});

	it('Should error when the given specName does not match the destChainIds specName', () => {
		const registry = parseRegistry({});

		const tests: Test[] = [
			[
				'2006',
				'Polkadot',
				['1', '2', '3', 'ASTR', 'DOT'],
				`non matching chains. Received: polkadot. Expected: astar`,
			],
			[
				'2004',
				'Bifrost_Polkadot',
				['1', '2', '3', 'GLMR'],
				`non matching chains. Received: bifrost_polkadot. Expected: moonbeam`,
			],
			[
				'2000',
				'Origintrail-Parachain',
				['ACA'],
				`non matching chains. Received: origintrail-parachain. Expected: acala`,
			],
		];

		for (const test of tests) {
			const [destChainId, specName, testInputs, errorMessage] = test;
			const relayChainName = findRelayChain(specName, registry);
			const currentRegistry = registry[relayChainName];

			const err = () =>
				checkAssetIdInput(testInputs, currentRegistry, specName, destChainId);
			expect(err).toThrow(errorMessage);
		}
	});
});
