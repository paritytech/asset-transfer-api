// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockParachainApi } from '../testHelpers/mockParachainApi';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { Direction } from '../types';
import {
	checkAllMultiLocationAssetIdsAreValid,
	checkAssetIdInput,
	checkAssetIdsAreOfSameAssetIdType,
	checkAssetIdsHaveNoDuplicates,
	checkAssetIdsLengthIsValid,
	checkAssetsAmountMatch,
	checkIfNativeRelayChainAssetPresentInMultiAssetIdList,
	checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain,
	checkRelayAmountsLength,
	checkRelayAssetIdLength,
	checkXcmVersionIsValidForPaysWithFeeDest,
} from './checkXcmTxInputs';

const runTests = async (tests: Test[]) => {
	for (const test of tests) {
		const [specName, testInputs, direction, errorMessage] = test;
		const registry = new Registry(specName, {});
		const currentRegistry = registry.currentRelayRegistry;

		await expect(async () => {
			await checkAssetIdInput(
				mockParachainApi,
				testInputs,
				currentRegistry,
				specName,
				direction,
				registry,
				false
			);
		}).rejects.toThrowError(errorMessage);
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
	specName: string,
	inputs: string[],
	xcmDirection: Direction,
	errorMessage: string
];

describe('checkAssetIds', () => {
	it('Should error when an assetId is found that is a blank space', async () => {
		const tests: Test[] = [
			[
				'Statemine',
				[' ', 'KSM'],
				Direction.SystemToRelay,
				`assetId cannot be blank spaces.`,
			],
		];

		await runTests(tests);
	});

	it('Should error when direction is RelayToSystem and assetId does not match relay chains native token', async () => {
		const tests: Test[] = [
			[
				'Polkadot',
				['1', 'DOT'],
				Direction.RelayToSystem,
				`RelayToSystem: asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToSystem,
				`RelayToSystem: asset DOT is not kusama's native asset. Expected KSM`,
			],
			[
				'Westend',
				['WND', '100000'],
				Direction.RelayToSystem,
				`RelayToSystem: asset 100000 is not westend's native asset. Expected WND`,
			],
		];

		await runTests(tests);
	});

	it('Should error when direction is RelayToPara and assetId does not match relay chains native token', async () => {
		const tests: Test[] = [
			[
				'Polkadot',
				['1', 'DOT'],
				Direction.RelayToPara,
				`RelayToPara: asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToPara,
				`RelayToPara: asset DOT is not kusama's native asset. Expected KSM`,
			],
		];

		await runTests(tests);
	});

	it('Should error when direction is SystemToRelay and an assetId is not native to the relay chain', async () => {
		const tests: Test[] = [
			[
				'Statemint',
				['0'],
				Direction.SystemToRelay,
				`SystemToRelay: assetId 0 not native to polkadot`,
			],
			[
				'Statemine',
				['MOVR', 'KSM'],
				Direction.SystemToRelay,
				`SystemToRelay: assetId MOVR not native to kusama`,
			],
			[
				'Westmint',
				['WND', '250'],
				Direction.SystemToRelay,
				`SystemToRelay: assetId 250 not native to westend`,
			],
		];

		await runTests(tests);
	});

	it('Should error when direction is SystemToPara and integer assetId is not found in system parachains assets', async () => {
		const tests: Test[] = [
			[
				'Statemine',
				['KSM', '8', 'stateMineDoge'],
				Direction.SystemToPara,
				`SystemToPara: assetId stateMineDoge not found for system parachain Statemine`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockSystemApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});

	it('Should error when direction is SystemToPara and the string assetId is not found in the system parachains tokens or assets', async () => {
		const tests: Test[] = [
			[
				'Statemint',
				['1337', 'xcDOT'],
				Direction.SystemToPara,
				`SystemToPara: assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToPara,
				`SystemToPara: assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToPara,
				`SystemToPara: assetId Test Westend not found for system parachain Westmint`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockSystemApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});

	it('Should error when an asset id is provided that matches multiple asset symbols in the assets registry', async () => {
		const tests: Test[] = [
			[
				'Statemine',
				['USDT'],
				Direction.SystemToPara,
				`Multiple assets found with symbol USDT`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockParachainApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});

	it('Should error when direction is SystemToSystem and the string assetId is not found in the system parachains tokens or assets', async () => {
		const tests: Test[] = [
			[
				'Statemint',
				['1337', 'xcDOT'],
				Direction.SystemToSystem,
				`SystemToSystem: assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToSystem,
				`SystemToSystem: assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToSystem,
				`SystemToSystem: assetId Test Westend not found for system parachain Westmint`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockSystemApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should error when direction is SystemToPara and the multilocation assetId is not found in the system parachains foreignAssets or chain state', async () => {
		const tests: Test[] = [
			[
				'Statemine',
				['{"parents":"2","interior":{"X1": {"Parachain":"2125000"}}}'],
				Direction.SystemToPara,
				`SystemToPara: assetId {"parents":"2","interior":{"X1": {"Parachain":"2125000"}}} not found for system parachain Statemine`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockSystemApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should error when direction is ParaToSystem and the string assetId is not found in the system parachains tokens or assets', async () => {
		const tests: Test[] = [
			[
				'Statemint',
				['1337', 'xcDOT'],
				Direction.ParaToSystem,
				`ParaToSystem: assetId xcDOT not found for system parachain statemint`,
			],
			[
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.ParaToSystem,
				`ParaToSystem: assetId xcMOVR not found for system parachain statemine`,
			],
			[
				'Westmint',
				['WND', 'Test Westend'],
				Direction.ParaToSystem,
				`ParaToSystem: assetId Test Westend not found for system parachain westmint`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					mockParachainApi,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					false
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should error for an invalid erc20 token.', async () => {
		const registry = new Registry('moonriver', {});
		const currentRegistry = registry.currentRelayRegistry;

		await expect(async () => {
			await checkAssetIdInput(
				mockParachainApi,
				['0x1234'],
				currentRegistry,
				'moonriver',
				Direction.ParaToSystem,
				registry,
				false
			);
		}).rejects.toThrowError(
			'ParaToSystem: assetId 0x1234, is not a valid erc20 token.'
		);
	});
});

describe('checkIfNativeRelayChainAssetPresentInMultiAssetIdList', () => {
	it('Should error when the relay native asset and system assets are in the same assetIds list when direction is SystemToSystem', () => {
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

describe('checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain', () => {
	it('Should correctly error when isForeignAssetsTransfer and both non native and foreign multilocations are in assetIds for direction SystemToPara', () => {
		const expectedErrorMessage =
			'SystemToPara: found both foreign and native multilocations in {"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}},{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "0"}]}}. multilocation XCMs must only include either native or foreign assets of the destination chain';
		const xcmDirection = Direction.SystemToPara;
		const destChainId = '2023';
		const multiLocationAssetIds = [
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}',
			'{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () =>
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(
				xcmDirection,
				destChainId,
				multiLocationAssetIds
			);

		expect(err).toThrowError(expectedErrorMessage);
	});

	it('Should correctly avoid throwing an error when isForeignAssetsTransfer and only native multilocations are in assetIds for direction SystemToPara', () => {
		const xcmDirection = Direction.SystemToPara;
		const destChainId = '2125';
		const multiLocationAssetIds = [
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}',
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "1"}]}}',
		];

		const err = () =>
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(
				xcmDirection,
				destChainId,
				multiLocationAssetIds
			);

		expect(err).not.toThrowError();
	});

	it('Should correctly avoid throwing an error when isForeignAssetsTransfer and only foreign multilocations are in assetIds for direction SystemToPara', () => {
		const xcmDirection = Direction.SystemToPara;
		const destChainId = '2125';
		const multiLocationAssetIds = [
			'{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "0"}]}}',
			'{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "1"}]}}',
		];

		const err = () =>
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(
				xcmDirection,
				destChainId,
				multiLocationAssetIds
			);

		expect(err).not.toThrowError();
	});
});

type CreateMultiLocationTest = [
	multiLocationAssetIds: string[],
	expected: string
];

describe('checkAllMultiLocationAssetIdsAreValid', () => {
	it('Should correctly error when an invalid multilocation is provided in assetIds', () => {
		const tests: CreateMultiLocationTest[] = [
			[
				[
					'{"parents":"1","interior":{"X2": [{"Parachain":"2125", {"GeneralIndex": "0"}]}}',
				],
				'Unexpected token { in JSON at position 55',
			],
			[
				[
					'{"parents":"1","interior":{"X2": [{"Parachain":"2,023"}, {"GeneralIndex": "0"}]}}',
				],
				'Error creating MultiLocation type with multilocation string value {"parents":"1","interior":{"X2": [{"Parachain":"2,023"}, {"GeneralIndex": "0"}]}}:  Enum(Parachain) String should not contain decimal points or scientific notation',
			],
		];

		for (const test of tests) {
			const [multiLocationAssetIds, expected] = test;
			const err = () =>
				checkAllMultiLocationAssetIdsAreValid(
					mockSystemApi,
					multiLocationAssetIds
				);

			expect(err).toThrowError(expected);
		}
	});
});

describe('checkAssetIdsLengthIsValid', () => {
	it('Should correctly error when more than 2 assetIds are passed in', () => {
		const assetIds = ['ksm', '1984', '10'];

		const err = () => checkAssetIdsLengthIsValid(assetIds);

		expect(err).toThrowError(
			'Maximum number of assets allowed for transfer is 2. Found 3 assetIds'
		);
	});
	it('Should correctly not error when less 2 or less assetIds are passed in', () => {
		const assetIds = ['ksm', '1984'];

		const err = () => checkAssetIdsLengthIsValid(assetIds);

		expect(err).not.toThrow(
			'Maximum number of assets allowed for transfer is 2. Found 3 assetIds'
		);
	});
});

describe('checkAssetIdsHaveNoDuplicates', () => {
	it('Should correctly error if duplicate empty string relay assetIds are found', () => {
		const assetIds = ['', ''];

		const err = () => checkAssetIdsHaveNoDuplicates(assetIds);

		expect(err).toThrow(
			'AssetIds must be unique. Found duplicate native relay assets as empty strings'
		);
	});
	it('Should correctly error if duplicate integer assetIds are found', () => {
		const assetIds = ['10', '10'];

		const err = () => checkAssetIdsHaveNoDuplicates(assetIds);

		expect(err).toThrow('AssetIds must be unique. Found duplicate assetId 10');
	});
	it('Should correctly error if duplicate integer assetIds are found', () => {
		const assetIds = ['usdt', 'USDT'];

		const err = () => checkAssetIdsHaveNoDuplicates(assetIds);

		expect(err).toThrow('AssetIds must be unique. Found duplicate assetId USDT');
	});
	it('Should correctly error if duplicate multilocation assetIds are found', () => {
		const assetIds = [
			'{"parents": "1","interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}',
			'{"parents": "1", "interior":{"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () => checkAssetIdsHaveNoDuplicates(assetIds);

		expect(err).toThrow(
			`AssetIds must be unique. Found duplicate assetId {"parents": "1", "interior":{"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}`
		);
	});
});

describe('checkAssetIdsAreOfSameAssetIdType', () => {
	it('Should correctly error when an integer assetId and multilocation assetId are passed in together', () => {
		const assetIds = [
			'1984',
			'{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			'Found both integer 1984 and multilocation assetId {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Asset Ids must be symbol and integer or multilocation exclusively.'
		);
	});

	it('Should correctly error when a symbol assetId and multilocation assetId are passed in together', () => {
		const assetIds = [
			'ksm',
			'{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			'Found both symbol ksm and multilocation assetId {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Asset Ids must be symbol and integer or multilocation exclusively.'
		);
	});

	it('Should correctly error when the default relay asset value and multilocation assetId are passed in together', () => {
		const assetIds = [
			'',
			'{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			'Found both default relay native asset and multilocation assetId: {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Asset Ids must be either be a combination of empty string, symbol and integer or multilocations exclusively.'
		);
	});
});

describe('checkXcmVersionIsValidForPaysWithFeeDest', () => {
	it('Should correctly throw an error if paysWithFeeDest is provided and xcmVersion is less than 3', () => {
		const xcmVersion = 2;
		const paysWithFeeDest = '1984';

		const err = () =>
			checkXcmVersionIsValidForPaysWithFeeDest(xcmVersion, paysWithFeeDest);

		expect(err).toThrow('paysWithFeeDest requires XCM version 3');
	});
	it('Should correctly not throw an error if paysWithFeeDest is provided and xcmVersion is at least 3', () => {
		const xcmVersion = 3;
		const paysWithFeeDest = '1984';

		const err = () =>
			checkXcmVersionIsValidForPaysWithFeeDest(xcmVersion, paysWithFeeDest);

		expect(err).not.toThrow('paysWithFeeDest requires XCM version 3');
	});
});
