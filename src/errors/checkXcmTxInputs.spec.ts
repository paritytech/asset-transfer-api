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
				'Polkadot',
				parseRegistry({})
			);

		expect(err).toThrow(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	});
});

describe('checkAssetIds', () => {
	it("Should error when inputted assetId's are not valid numbers or valid token symbols", () => {
		const specName = 'Polkadot';
		const registry = parseRegistry({});
		const relayChainName = findRelayChain(specName, registry);
		const currentRegistry = registry[relayChainName];
		const erroneousAssetId = 'hello';

		const err = () =>
			checkAssetIdInput(['DOT', 'hello', '10'], currentRegistry, specName);

		expect(err).toThrow(
			`'assetIds' must be either valid number or valid chain token symbols. Got: ${erroneousAssetId}`
		);
	});

	it('Should error when a token in assetIds does not exactly match a valid token symbol', () => {
		const specName = 'Polkadot';
		const registry = parseRegistry({});
		const relayChainName = findRelayChain(specName, registry);
		const currentRegistry = registry[relayChainName];
		const erroneousAssetId = 'dot';

		const err = () =>
			checkAssetIdInput(['1', '2', '3', 'dot'], currentRegistry, specName);

		expect(err).toThrow(
			`'assetIds' must be either valid number or valid chain token symbols. Got: ${erroneousAssetId}`
		);
	});
});
