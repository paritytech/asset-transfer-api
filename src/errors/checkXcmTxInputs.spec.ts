// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../AssetTransferApi';
import { XcmPalletName } from '../createXcmCalls/util/establishXcmPallet';
import { Registry } from '../registry';
import { adjustedMockMoonriverParachainApi } from '../testHelpers/adjustedMockMoonriverParachainApi';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApiV1004000';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { Direction } from '../types';
import {
	checkAssetIdInput,
	checkAssetIdsAreOfSameAssetIdType,
	checkAssetIdsHaveNoDuplicates,
	checkAssetIdsLengthIsValid,
	checkAssetsAmountMatch,
	checkIfNativeRelayChainAssetPresentInMultiAssetIdList,
	checkLiquidTokenTransferDirectionValidity,
	checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain,
	checkParaAssets,
	checkParaPrimaryAssetAmountsLength,
	checkParaPrimaryAssetAssetIdsLength,
	checkRelayAmountsLength,
	checkRelayAssetIdLength,
	checkXcmVersionIsValidForPaysWithFeeDest,
	CheckXTokensPalletOriginIsNonForeignAssetTx,
} from './checkXcmTxInputs';

const parachainAssetsApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'moonriver', 2, {
	registryType: 'NPM',
});
const runTests = async (tests: Test[]) => {
	for (const test of tests) {
		const [specName, testInputs, direction, errorMessage] = test;
		const registry = new Registry(specName, {});
		const currentRegistry = registry.currentRelayRegistry;

		await expect(async () => {
			await checkAssetIdInput(
				parachainAssetsApi.api,
				testInputs,
				currentRegistry,
				specName,
				direction,
				registry,
				2,
				false,
				false,
			);
		}).rejects.toThrowError(errorMessage);
	}
};

describe('checkRelayAssetIdLength', () => {
	it('Should error with an incorrect assetId length for inputs to or from relay chains', () => {
		const err = () => checkRelayAssetIdLength(['dot', 'usdt']);

		expect(err).toThrow("`assetIds` should be empty or length 1 when sending tx's to or from the relay chain.");
	});
});

describe('checkRelayAmountsLength', () => {
	it('Should error with an incorrect amounts length', () => {
		const err = () => checkRelayAmountsLength(['1000000000', '10000000000']);
		expect(err).toThrow('`amounts` should be of length 1 when sending to or from a relay chain');
	});
});

describe('checkAssetsAmountMatch', () => {
	it("Should error when inputted assetId's dont match amounts length", () => {
		const err = () => checkAssetsAmountMatch(['1'], ['10', '10']);

		expect(err).toThrow(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.',
		);
	});
});

describe('checkParaPrimaryAssetAssetIdsLength', () => {
	it('Should error with an incorrect assetId length when sending a primary parachain native asset', () => {
		const err = () => checkParaPrimaryAssetAssetIdsLength(['movr', 'usdt']);

		expect(err).toThrow('`assetIds` should be of length 1 when sending a primary native parachain asset');
	});
});

describe('checkParaPrimaryAssetAmountsLength', () => {
	it('Should error with an incorrect amounts length when sending a primary parachain native asset', () => {
		const err = () => checkParaPrimaryAssetAmountsLength(['1000000', '200000']);

		expect(err).toThrow('`amounts` should be of length 1 when sending a primary native parachain asset');
	});
});

type Test = [specName: string, inputs: string[], xcmDirection: Direction, errorMessage: string];

describe('checkAssetIds', () => {
	it('Should error when an assetId is found that is a blank space', async () => {
		const tests: Test[] = [['Statemine', [' ', 'KSM'], Direction.SystemToRelay, `assetId cannot be blank spaces.`]];

		await runTests(tests);
	});

	it('Should error when direction is RelayToSystem and assetId does not match relay chains native token', async () => {
		const tests: Test[] = [
			[
				'Polkadot',
				['1', 'DOT'],
				Direction.RelayToSystem,
				`(RelayToSystem) asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToSystem,
				`(RelayToSystem) asset DOT is not kusama's native asset. Expected KSM`,
			],
			[
				'Westend',
				['WND', '100000'],
				Direction.RelayToSystem,
				`(RelayToSystem) asset 100000 is not westend's native asset. Expected WND`,
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
				`(RelayToPara) asset 1 is not polkadot's native asset. Expected DOT`,
			],
			[
				'Kusama',
				['DOT', 'KSM'],
				Direction.RelayToPara,
				`(RelayToPara) asset DOT is not kusama's native asset. Expected KSM`,
			],
		];

		await runTests(tests);
	});

	it('Should error when direction is SystemToRelay and an assetId is not native to the relay chain', async () => {
		const tests: Test[] = [
			['Statemint', ['0'], Direction.SystemToRelay, `(SystemToRelay) assetId 0 not native to polkadot`],
			['Statemine', ['MOVR', 'KSM'], Direction.SystemToRelay, `(SystemToRelay) assetId MOVR not native to kusama`],
			['Westmint', ['WND', '250'], Direction.SystemToRelay, `(SystemToRelay) assetId 250 not native to westend`],
		];

		await runTests(tests);
	});

	it('Should error when direction is SystemToPara and integer assetId is not found in system parachains assets', async () => {
		const tests: Test[] = [
			[
				'Statemine',
				['KSM', '8', 'stateMineDoge'],
				Direction.SystemToPara,
				`(SystemToPara) assetId stateMineDoge not found for system parachain Statemine`,
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
					2,
					false,
					false,
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
				`(SystemToPara) assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToPara,
				`(SystemToPara) assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToPara,
				`(SystemToPara) assetId Test Westend not found for system parachain Westmint`,
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
					2,
					false,
					false,
				);
			}).rejects.toThrowError(errorMessage);
		}
	});

	it('Should error when an asset id is provided that matches multiple asset symbols in the assets registry', async () => {
		const tests: Test[] = [['Statemine', ['USDT'], Direction.SystemToPara, `Multiple assets found with symbol USDT`]];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					parachainAssetsApi.api,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					2,
					false,
					false,
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
				`(SystemToSystem) assetId xcDOT not found for system parachain Statemint`,
			],
			[
				'Statemine',
				['KSM', 'xcMOVR'],
				Direction.SystemToSystem,
				`(SystemToSystem) assetId xcMOVR not found for system parachain Statemine`,
			],
			[
				'Westmint',
				['WND', 'Test Westend'],
				Direction.SystemToSystem,
				`(SystemToSystem) assetId Test Westend not found for system parachain Westmint`,
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
					2,
					false,
					false,
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
				`(SystemToPara) assetId {"parents":"2","interior":{"X1": {"Parachain":"2125000"}}} not found for system parachain Statemine`,
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
					2,
					false,
					false,
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should correctly error when direction is ParaToSystem and the provided integer assetId is not found in the system parachains assetIds', async () => {
		const tests: Test[] = [
			[
				'moonriver',
				['311091173110107856861649819128533077277', '200'],
				Direction.ParaToSystem,
				`(ParaToSystem) integer assetId 200 not found in moonriver`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;
			await expect(async () => {
				await checkAssetIdInput(
					parachainAssetsApi.api,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					2,
					false,
					false,
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should correctly error when direction is ParaToSystem and the string assetId has no match in the parachains asset symbols', async () => {
		const tests: Test[] = [
			[
				'moonriver',
				['xcKSMFake', 'USDT'],
				Direction.ParaToSystem,
				`(ParaToSystem) symbol assetId xcKSMFake not found for parachain moonriver`,
			],
			[
				'moonriver',
				['xcUSDT', 'ASTR'],
				Direction.ParaToSystem,
				`(ParaToSystem) symbol assetId ASTR not found for parachain moonriver`,
			],
		];

		for (const test of tests) {
			const [specName, testInputs, direction, errorMessage] = test;
			const registry = new Registry(specName, {});
			const currentRegistry = registry.currentRelayRegistry;

			await expect(async () => {
				await checkAssetIdInput(
					parachainAssetsApi.api,
					testInputs,
					currentRegistry,
					specName,
					direction,
					registry,
					2,
					false,
					false,
				);
			}).rejects.toThrowError(errorMessage);
		}
	});
	it('Should error for an invalid erc20 token.', async () => {
		const registry = new Registry('moonriver', {});
		const currentRegistry = registry.currentRelayRegistry;

		await expect(async () => {
			await checkAssetIdInput(
				parachainAssetsApi.api,
				['0x1234'],
				currentRegistry,
				'moonriver',
				Direction.ParaToSystem,
				registry,
				2,
				false,
				false,
			);
		}).rejects.toThrowError('(ParaToSystem) assetId 0x1234, is not a valid erc20 token.');
	});
	it('Should error when an invalid token is passed into a liquidTokenTransfer', async () => {
		const registry = new Registry('westmint', {});
		const currentRegistry = registry.currentRelayRegistry;
		const isLiquidTokenTransfer = true;

		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockSystemApi,
				['TEST'],
				currentRegistry,
				'westmint',
				Direction.SystemToPara,
				registry,
				2,
				false,
				isLiquidTokenTransfer,
			);
		}).rejects.toThrowError('Liquid Tokens must be valid Integers');
	});
	it('Should error when a token does not exist in the registry or node', async () => {
		const registry = new Registry('westmint', {});
		const currentRegistry = registry.currentRelayRegistry;
		const isLiquidTokenTransfer = true;

		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockSystemApi,
				['999111'],
				currentRegistry,
				'westmint',
				Direction.SystemToPara,
				registry,
				2,
				false,
				isLiquidTokenTransfer,
			);
		}).rejects.toThrowError(
			'No liquid token asset was detected. When setting the option "transferLiquidToken" to true a valid liquid token assetId must be present.',
		);
	});
	it('Should not error when a valid liquid token exists', async () => {
		const registry = new Registry('westmint', {});
		const currentRegistry = registry.currentRelayRegistry;
		const isLiquidTokenTransfer = true;

		// eslint-disable-next-line @typescript-eslint/await-thenable
		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockSystemApi,
				['0'],
				currentRegistry,
				'westmint',
				Direction.SystemToPara,
				registry,
				2,
				false,
				isLiquidTokenTransfer,
			);
		}).not.toThrow();
	});
	it('Should not throw an error for ParaToRelay when its a valid', async () => {
		const registry = new Registry('moonriver', {});
		const currentRegistry = registry.currentRelayRegistry;
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				['KSM'],
				currentRegistry,
				'moonriver',
				Direction.ParaToRelay,
				registry,
				2,
				false,
				false,
			);
		}).not.toThrow();
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				['42259045809535163221576417993425387648'],
				currentRegistry,
				'moonriver',
				Direction.ParaToRelay,
				registry,
				2,
				false,
				false,
			);
		}).not.toThrow();
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				[''],
				currentRegistry,
				'moonriver',
				Direction.ParaToRelay,
				registry,
				2,
				false,
				false,
			);
		}).not.toThrow();
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				[],
				currentRegistry,
				'moonriver',
				Direction.ParaToRelay,
				registry,
				2,
				false,
				false,
			);
		}).not.toThrow();
	});
	it('Should error when an invalid assetId is inputted for ParaToRelay', async () => {
		const registry = new Registry('karura', {});
		const currentRegistry = registry.currentRelayRegistry;

		await expect(async () => {
			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				['TEST'],
				currentRegistry,
				'crust-collator',
				Direction.ParaToRelay,
				registry,
				2,
				false,
				false,
			);
		}).rejects.toThrowError(
			"The current input for assetId's does not meet our specifications for ParaToRelay transfers.",
		);
	});
});

describe('checkIfNativeRelayChainAssetPresentInMultiAssetIdList', () => {
	it('Should error when the relay native asset and system assets are in the same assetIds list when direction is SystemToSystem', () => {
		const expectErrorMessage =
			'Found the relay chains native asset in list [ksm,usdc]. `assetIds` list must be empty or only contain the relay chain asset for direction SystemToSystem when sending the relay chains native asset.';
		const assetIds = ['ksm', 'usdc'];
		const specName = 'statemine';
		const registry = new Registry(specName, {});

		const err = () => checkIfNativeRelayChainAssetPresentInMultiAssetIdList(assetIds, registry);
		expect(err).toThrowError(expectErrorMessage);
	});
});

describe('checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain', () => {
	it('Should correctly error when isForeignAssetsTransfer and both non native and foreign multilocations are in assetIds for direction SystemToPara', () => {
		const expectedErrorMessage =
			'(SystemToPara) found both foreign and native multilocations in {"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}},{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "0"}]}}. multilocation XCMs must only include either native or foreign assets of the destination chain.';
		const xcmDirection = Direction.SystemToPara;
		const destChainId = '2023';
		const multiLocationAssetIds = [
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}',
			'{"parents":"1","interior":{"X2": [{"Parachain":"2023"}, {"GeneralIndex": "0"}]}}',
		];

		const err = () =>
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(xcmDirection, destChainId, multiLocationAssetIds);

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
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(xcmDirection, destChainId, multiLocationAssetIds);

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
			checkMultiLocationsContainOnlyNativeOrForeignAssetsOfDestChain(xcmDirection, destChainId, multiLocationAssetIds);

		expect(err).not.toThrowError();
	});
});

describe('checkAssetIdsLengthIsValid', () => {
	it('Should correctly error when more than 2 assetIds are passed in', () => {
		const assetIds = ['ksm', '1984', '10'];

		const err = () => checkAssetIdsLengthIsValid(assetIds);

		expect(err).toThrowError('Maximum number of assets allowed for transfer is 2. Found 3 assetIds');
	});
	it('Should correctly not error when less 2 or less assetIds are passed in', () => {
		const assetIds = ['ksm', '1984'];

		const err = () => checkAssetIdsLengthIsValid(assetIds);

		expect(err).not.toThrow('Maximum number of assets allowed for transfer is 2. Found 3 assetIds');
	});
});

describe('checkAssetIdsHaveNoDuplicates', () => {
	it('Should correctly error if duplicate empty string relay assetIds are found', () => {
		const assetIds = ['', ''];

		const err = () => checkAssetIdsHaveNoDuplicates(assetIds);

		expect(err).toThrow('AssetIds must be unique. Found duplicate native relay assets as empty strings');
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
			`AssetIds must be unique. Found duplicate assetId {"parents": "1", "interior":{"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}`,
		);
	});
});

describe('checkAssetIdsAreOfSameAssetIdType', () => {
	it('Should correctly error when an integer assetId and multilocation assetId are passed in together', () => {
		const assetIds = ['1984', '{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}'];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			`Found both native asset with assetID 1984 and foreign asset with assetId {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Native assets and foreign assets can't be transferred within the same call.`,
		);
	});

	it('Should correctly error when a symbol assetId and multilocation assetId are passed in together', () => {
		const assetIds = ['ksm', '{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}'];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			'Found both symbol ksm and multilocation assetId {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Asset Ids must be symbol and integer or multilocation exclusively.',
		);
	});

	it('Should correctly error when the default relay asset value and multilocation assetId are passed in together', () => {
		const assetIds = ['', '{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}'];

		const err = () => checkAssetIdsAreOfSameAssetIdType(assetIds);

		expect(err).toThrow(
			`Found both default relay native asset and foreign asset with assetId: {"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}. Relay native asset and foreign assets can't be transferred within the same call.`,
		);
	});
});

describe('checkXcmVersionIsValidForPaysWithFeeDest', () => {
	it('Should correctly throw an error if paysWithFeeDest is provided and xcmVersion is less than 3', () => {
		const xcmVersion = 2;
		const paysWithFeeDest = '1984';

		const err = () => checkXcmVersionIsValidForPaysWithFeeDest(Direction.SystemToPara, xcmVersion, paysWithFeeDest);

		expect(err).toThrow('paysWithFeeDest requires XCM version 3');
	});
	it('Should correctly not throw an error if paysWithFeeDest is provided and xcmVersion is at least 3', () => {
		const xcmVersion = 3;
		const paysWithFeeDest = '1984';

		const err = () => checkXcmVersionIsValidForPaysWithFeeDest(Direction.SystemToPara, xcmVersion, paysWithFeeDest);

		expect(err).not.toThrow('paysWithFeeDest requires XCM version 3');
	});

	it('Should correctly not throw an error if xcmDirection is ParaToSystem or ParaToPara', () => {
		const xcmVersion = 3;
		const paysWithFeeDest = '1984';

		const err = () => checkXcmVersionIsValidForPaysWithFeeDest(Direction.ParaToSystem, xcmVersion, paysWithFeeDest);

		expect(err).not.toThrow('paysWithFeeDest requires XCM version 3');
	});
});

describe('CheckXTokensPalletOriginIsNonForeignAssetTx', () => {
	it('Should correctly throw an error when xcm pallet is xTokens and isForeignAssetsTransfer is true', () => {
		type Test = [isForeignAssetTransfer: boolean, xcmPallet: XcmPalletName, xcmDirection: Direction];

		const tests: Test[] = [
			[true, XcmPalletName.xTokens, Direction.ParaToSystem],
			[true, XcmPalletName.xTokens, Direction.ParaToPara],
		];

		for (const test of tests) {
			const [isForeignAssetsTransfer, xcmPallet, xcmDirection] = test;

			const err = () => {
				CheckXTokensPalletOriginIsNonForeignAssetTx(xcmDirection, xcmPallet, isForeignAssetsTransfer);
			};

			expect(err).toThrow(`(${xcmDirection}) xTokens pallet does not support foreign asset transfers`);
		}
	});
});

describe('checkLiquidTokenTransferDirectionValidity', () => {
	it('Should correctly throw an error when inputs dont match the specification', () => {
		const err = () => checkLiquidTokenTransferDirectionValidity(Direction.ParaToSystem, true);

		expect(err).toThrow('isLiquidTokenTransfer may not be true for the xcmDirection: ParaToSystem.');
	});
});

describe('checkParaAssets', () => {
	it('Should correctly resolve when a valid symbol assetId is provided', async () => {
		const assetId = 'xcUSDt';
		const specName = 'moonriver';
		const registry = new Registry(specName, {});
		let didNotError = true;

		try {
			await checkParaAssets(adjustedMockMoonriverParachainApi, assetId, specName, registry, Direction.ParaToSystem);
		} catch (err) {
			didNotError = false;
		}

		expect(didNotError).toBeTruthy();
	});
	it('Should correctly resolve when a valid integer assetId is provided', async () => {
		const assetId = '311091173110107856861649819128533077277';
		const specName = 'moonriver';
		const registry = new Registry(specName, {});
		let didNotError = true;

		try {
			await checkParaAssets(adjustedMockMoonriverParachainApi, assetId, specName, registry, Direction.ParaToSystem);
		} catch (err) {
			didNotError = false;
		}

		expect(didNotError).toBeTruthy();
	});
	it('Should correctly error when an invalid symbol assetId is provided', async () => {
		const assetId = 'xcUSDfake';
		const specName = 'moonriver';
		const registry = new Registry(specName, {});

		await expect(async () => {
			await checkParaAssets(adjustedMockMoonriverParachainApi, assetId, specName, registry, Direction.ParaToSystem);
		}).rejects.toThrowError('(ParaToSystem) symbol assetId xcUSDfake not found for parachain moonriver');
	});
	it('Should correctly error when an invalid integer assetId is provided', async () => {
		const assetId = '2096586909097964981698161';
		const specName = 'moonriver';
		const registry = new Registry(specName, {});

		await expect(async () => {
			await checkParaAssets(adjustedMockMoonriverParachainApi, assetId, specName, registry, Direction.ParaToSystem);
		}).rejects.toThrowError('(ParaToSystem) integer assetId 2096586909097964981698161 not found in moonriver');
	});
	it('Should correctly error when a valid assetId is not found in the xcAsset registry', async () => {
		const assetId = '999999999999999999999999999999999999999';
		const specName = 'moonriver';
		const registry = new Registry(specName, {});

		await expect(async () => {
			await checkParaAssets(adjustedMockMoonriverParachainApi, assetId, specName, registry, Direction.ParaToSystem);
		}).rejects.toThrowError('unable to identify xcAsset with ID 999999999999999999999999999999999999999');
	});

	describe('cache', () => {
		it('Should correctly cache an asset that is not found in the registry after being queried for origin System', async () => {
			const registry = new Registry('statemine', {});
			const chainInfo = {
				'1000': {
					assetsInfo: {},
					poolPairsInfo: {},
					specName: '',
					tokens: [],
					foreignAssetsInfo: {},
				},
			};

			await checkAssetIdInput(
				adjustedMockSystemApi,
				['1984'],
				chainInfo,
				'statemine',
				Direction.SystemToPara,
				registry,
				2,
				false,
				false,
			);

			expect(registry.cacheLookupAsset('1984')).toEqual('USDt');
		});
		it('Should correctly cache an asset that is not found in the registry after being queried for origin Para', async () => {
			const registry = new Registry('moonriver', {});
			const chainInfo = {
				'2023': {
					assetsInfo: {},
					poolPairsInfo: {},
					specName: '',
					tokens: [],
					foreignAssetsInfo: {},
				},
			};

			await checkAssetIdInput(
				adjustedMockMoonriverParachainApi,
				['xcUSDT'],
				chainInfo,
				'moonriver',
				Direction.ParaToSystem,
				registry,
				2,
				false,
				false,
			);

			expect(registry.cacheLookupAsset('xcUSDT')).toEqual('311091173110107856861649819128533077277');
		});

		it('Should correctly cache a foreign asset that is not found in the registry after being queried', async () => {
			const registry = new Registry('statemine', {
				injectedRegistry: {
					kusama: {
						'1000': {
							assetsInfo: {},
							poolPairsInfo: {},
							specName: '',
							tokens: [],
							foreignAssetsInfo: {},
						},
					},
				},
			});
			const chainInfo = {
				'1000': {
					assetsInfo: {},
					poolPairsInfo: {},
					specName: '',
					tokens: [],
					foreignAssetsInfo: {},
				},
			};

			await checkAssetIdInput(
				adjustedMockSystemApi,
				['{"parents":"1","interior":{"X2":[{"Parachain":"1103"},{"GeneralIndex":"0"}]}}'],
				chainInfo,
				'statemine',
				Direction.SystemToPara,
				registry,
				2,
				true,
				false,
			);

			expect(registry.cacheLookupForeignAsset('GDZ')).toEqual({
				multiLocation: '{"Parents":"1","Interior":{"X2":[{"Parachain":"1103"},{"GeneralIndex":"0"}]}}',
				name: 'Godzilla',
				symbol: 'GDZ',
			});
		});

		it('Should correctly cache a liquid asset that is not found in the registry after being queried', async () => {
			const registry = new Registry('statemine', {
				injectedRegistry: {
					kusama: {
						'1000': {
							assetsInfo: {},
							poolPairsInfo: {},
							specName: '',
							tokens: [],
							foreignAssetsInfo: {},
						},
					},
				},
			});
			const chainInfo = {
				'1000': {
					assetsInfo: {},
					poolPairsInfo: {},
					specName: '',
					tokens: [],
					foreignAssetsInfo: {},
				},
			};

			await checkAssetIdInput(
				adjustedMockSystemApi,
				['0'],
				chainInfo,
				'statemine',
				Direction.SystemToPara,
				registry,
				2,
				false,
				true,
			);

			expect(registry.cacheLookupPoolAsset('0')).toEqual({
				lpToken: '0',
				pairInfo:
					'[{"parents":"0","interior":{"Here":""}},{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"100"}]}}]',
			});
		});
	});
});
