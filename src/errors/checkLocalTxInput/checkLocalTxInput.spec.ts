// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../../AssetTransferApi';
import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { checkLocalTxInput } from './checkLocalTxInput';

describe('checkLocalTxInput', () => {
	const registry = new Registry('statemine', {});
	const specName = 'statemine';

	const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });

	it('Should correctly return Balances with an empty assetIds', async () => {
		const res = await checkLocalTxInput(systemAssetsApi.api, [], ['10000'], specName, registry, 2, false, false);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Balances with a native token', async () => {
		const res = await checkLocalTxInput(systemAssetsApi.api, ['KSM'], ['10000'], specName, registry, 2, false, false);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Balances with an empty string assetId', async () => {
		const res = await checkLocalTxInput(systemAssetsApi.api, [''], ['10000'], specName, registry, 2, false, false);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Assets with a valid assetId', async () => {
		const res = await checkLocalTxInput(systemAssetsApi.api, ['1984'], ['10000'], specName, registry, 2, false, false);
		expect(res).toEqual('Assets');
	});
	it('Should correctly throw an error for incorrect length on `assetIds`', async () => {
		await expect(async () => {
			await checkLocalTxInput(systemAssetsApi.api, ['1', '2'], ['10000'], specName, registry, 2, false, false);
		}).rejects.toThrow(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
		);
	});
	it('Should correctly throw an error for incorrect length on `amounts`', async () => {
		await expect(async () => {
			await checkLocalTxInput(systemAssetsApi.api, ['1'], ['10000', '20000'], specName, registry, 2, false, false);
		}).rejects.toThrow(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
		);
	});
	it('Should correctly throw an error with an incorrect assetId', async () => {
		await expect(async () => {
			await checkLocalTxInput(systemAssetsApi.api, ['TST'], ['10000'], specName, registry, 2, false, false);
		}).rejects.toThrow('assetId TST is not a valid symbol, integer asset id or location for statemine');
	});
	it("Should correctly throw an error when the integer assetId doesn't exist", async () => {
		await expect(async () => {
			await checkLocalTxInput(systemAssetsApi.api, ['9876111'], ['10000'], specName, registry, 2, false, false);
		}).rejects.toThrow('general index for assetId 9876111 was not found');
	});

	it('Should correctly return ForeignAssets when given a valid multilocation', async () => {
		const res = await checkLocalTxInput(
			systemAssetsApi.api,
			['{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}'],
			['10000'],
			specName,
			registry,
			2,
			true,
			false,
		);
		expect(res).toEqual('ForeignAssets');
	});
	it('Should correctly throw an error when given an invalid multilocation', async () => {
		const incorrectMultiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2,125"}, {"GeneralIndex": "0"}]}}';
		const expectedError = `Error creating MultiLocation type: Enum(Parachain) String should not contain decimal points or scientific notation`;

		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi.api,
				[incorrectMultiLocationStr],
				['10000'],
				specName,
				registry,
				2,
				true,
				false,
			);
		}).rejects.toThrow(expectedError);
	});
	it("Should correctly throw an error when the given multilocation doesn't exist", async () => {
		const nonExistentMultiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "1000000"}]}}';
		const expectedError = `MultiLocation ${nonExistentMultiLocationStr} not found`;

		await expect(async () => {
			await checkLocalTxInput(
				systemAssetsApi.api,
				[nonExistentMultiLocationStr],
				['10000'],
				specName,
				registry,
				2,
				true,
				false,
			);
		}).rejects.toThrow(expectedError);
	});

	it('Should correctly throw an error when the given multilocation assetIds is empty', async () => {
		const expectedError = 'Local foreignAsset transactions must have the `assetIds` input be a length of 1';

		await expect(async () => {
			await checkLocalTxInput(systemAssetsApi.api, [], ['10000'], specName, registry, 2, true, false);
		}).rejects.toThrow(expectedError);
	});
});
