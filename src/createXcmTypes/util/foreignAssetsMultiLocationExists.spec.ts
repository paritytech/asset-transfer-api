// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';

describe('foreignMultiAssetMultiLocationExists', () => {
	const registry = new Registry('statemine', {});

	it('Should return true for an existing foreign asset multilocation', async () => {
		const expected = true;
		const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"1103"}, {"GeneralIndex": "0"}]}}';

		const isValid = await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation);

		expect(isValid).toEqual(expected);
	});

	it('Should return false for a non existing foreign asset multilocation', async () => {
		const expected = false;
		const multiLocation = '{"parents":"1","interior":{"X1": {"Parachain":"21252525"}}}';

		const isValid = await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation);

		expect(isValid).toEqual(expected);
	});

	it('Should throw an invalid character error when an invalid character is found in a multilocation keys value', async () => {
		const expectedError = 'Error creating MultiLocation type: Enum(Parachain) Invalid character';
		const multiLocation = '{"parents":"1","interior":{"X1": {"Parachain":"g2125"}}}';

		await expect(async () => {
			await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation);
		}).rejects.toThrow(expectedError);
	});

	it('Should throw an error when a comma is found in a multilocation keys value', async () => {
		const expectedError =
			'Error creating MultiLocation type: Enum(Parachain) String should not contain decimal points or scientific notation';
		const multiLocation = '{"parents":"2","interior":{"X1": {"Parachain":"2,125"}}}';

		await expect(async () => {
			await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation);
		}).rejects.toThrow(expectedError);
	});

	it('Should correctly cache a valid foreign asset not found in the cache or registry', async () => {
		const emptyRegistry = new Registry('statemine', {
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
		const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"1103"}, {"GeneralIndex": "0"}]}}';

		await foreignAssetsMultiLocationExists(adjustedMockSystemApi, emptyRegistry, multiLocation);

		const result = emptyRegistry.cacheLookupForeignAsset('GDZ');

		expect(result).toEqual({
			multiLocation: '{"parents":"1","interior":{"X2":[{"Parachain":"1103"},{"GeneralIndex":"0"}]}}',
			name: 'Godzilla',
			symbol: 'GDZ',
		});
	});
});
