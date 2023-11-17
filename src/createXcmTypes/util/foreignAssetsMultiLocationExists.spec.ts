// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApi';
import { foreignAssetsMultiLocationExists } from './foreignAssetsMultiLocationExists';
import { mockAssetRegistry } from '../../testHelpers/mockAssetRegistry';
import { ChainInfoRegistry } from 'src/registry/types';

describe('foreignMultiAssetMultiLocationExists', () => {
	const registry = new Registry('statemine', mockAssetRegistry);

	it('Should return true for an existing foreign asset multilocation', async () => {
		const expected = true;
		const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';

		const isValid = await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation, 2);

		expect(isValid).toEqual(expected);
	});

	it('Should return false for a non existing foreign asset multilocation', async () => {
		const expected = false;
		const multiLocation = '{"parents":"1","interior":{"X1": {"Parachain":"21252525"}}}';

		const isValid = await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation, 2);

		expect(isValid).toEqual(expected);
	});

	it('Should throw an invalid character error when an invalid character is found in a multilocation keys value', async () => {
		const expectedError = 'Error creating MultiLocation type: Enum(Parachain) Invalid character';
		const multiLocation = '{"parents":"1","interior":{"X1": {"Parachain":"g2125"}}}';

		await expect(async () => {
			await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation, 2);
		}).rejects.toThrowError(expectedError);
	});

	it('Should throw an error when a comma is found in a multilocation keys value', async () => {
		const expectedError =
			'Error creating MultiLocation type: Enum(Parachain) String should not contain decimal points or scientific notation';
		const multiLocation = '{"parents":"2","interior":{"X1": {"Parachain":"2,125"}}}';

		await expect(async () => {
			await foreignAssetsMultiLocationExists(adjustedMockSystemApi, registry, multiLocation, 2);
		}).rejects.toThrowError(expectedError);
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
		} as unknown as ChainInfoRegistry);
		const multiLocation = '{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';

		await foreignAssetsMultiLocationExists(adjustedMockSystemApi, emptyRegistry, multiLocation, 2);

		const result = emptyRegistry.cacheLookupForeignAsset('TNKR');

		expect(result).toEqual({
			multiLocation: '{"Parents":"1","Interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
			name: 'Tinkernet',
			symbol: 'TNKR',
		});
	});
});
