// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetsTransferApi } from '../AssetsTransferApi';
import { Registry } from '../registry';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import { checkLocalTxInput } from './checkLocalTxInputs';

describe('checkLocalTxInput', () => {
	const registry = new Registry('statemine', {});
	const specName = 'statemine';

	const systemAssetsApi = new AssetsTransferApi(
		adjustedMockSystemApi,
		'statemine',
		2
	);

	it('Should correctly return Balances with an empty assetIds', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi._api,
			[],
			['10000'],
			specName,
			registry,
			false,
			false
		);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Balances with a native token', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi._api,
			['KSM'],
			['10000'],
			specName,
			registry,
			false,
			false
		);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Balances with an empty string assetId', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi._api,
			[''],
			['10000'],
			specName,
			registry,
			false,
			false
		);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Assets with a valid assetId', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi._api,
			['1984'],
			['10000'],
			specName,
			registry,
			false,
			false
		);
		expect(res).toEqual('Assets');
	});
	it('Should correctly throw an error for incorrect length on `assetIds`', async () => {
		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				['1', '2'],
				['10000'],
				specName,
				registry,
				false,
				false
			);
		}).rejects.toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error for incorrect length on `amounts`', async () => {
		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				['1'],
				['10000', '20000'],
				specName,
				registry,
				false,
				false
			);
		}).rejects.toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error with an incorrect assetId', async () => {
		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				['TST'],
				['10000'],
				specName,
				registry,
				false,
				false
			);
		}).rejects.toThrowError(
			'assetId TST is not a valid symbol or integer asset id for statemine'
		);
	});
	it("Should correctly throw an error when the integer assetId doesn't exist", async () => {
		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				['9876111'],
				['10000'],
				specName,
				registry,
				false,
				false
			);
		}).rejects.toThrowError('general index for assetId 9876111 was not found');
	});

	it('Should correctly return ForeignAssets when given a valid multilocation', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi._api,
			[
				'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}',
			],
			['10000'],
			specName,
			registry,
			true,
			false
		);
		expect(res).toEqual('ForeignAssets');
	});
	it('Should correctly throw an error when given an invalid multilocation', async () => {
		const incorrectMultiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2,125"}, {"GeneralIndex": "0"}]}}';
		const expectedError = "Error creating MultiLocation type: Enum(Parachain) String should not contain decimal points or scientific notation";

		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				[incorrectMultiLocationStr],
				['10000'],
				specName,
				registry,
				true,
				false
			);
		}).rejects.toThrowError(expectedError);
	});
	it("Should correctly throw an error when the given multilocation doesn't exist", async () => {
		const nonExistentMultiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "1000000"}]}}';
		const expectedError = `MultiLocation ${nonExistentMultiLocationStr} not found`;

		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				[nonExistentMultiLocationStr],
				['10000'],
				specName,
				registry,
				true,
				false
			);
		}).rejects.toThrowError(expectedError);
	});

	it('Should correctly throw an error when the given multilocation assetIds is empty', async () => {
		const expectedError =
			'Local foreignAsset transactions must have the `assetIds` input be a length of 1';

		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi._api,
				[],
				['10000'],
				specName,
				registry,
				true,
				false
			);
		}).rejects.toThrowError(expectedError);
	});
});
