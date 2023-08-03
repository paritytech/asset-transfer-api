// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { foreignAssetMultiLocationIsInRegistry } from './foreignAssetMultiLocationIsInRegistry';

describe('foreignAssetMultiLocationIsInRegistry', () => {
	it('Should return true if a given foreign asset multilocation exists in the asset api registry', () => {
		const expected = true;
		const multiLocation =
			'{"parents":"1","interior":{ "X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}';
		const registry = new Registry('statemine', {});

		const foreignAssetExistsInRegistry = foreignAssetMultiLocationIsInRegistry(
			mockSystemApi,
			multiLocation,
			registry
		);

		expect(foreignAssetExistsInRegistry).toEqual(expected);
	});

	it('Should return false if a given foreign asset multilocation does not exist in the asset api registry', () => {
		const expected = false;
		const multiLocation =
			'{"parents":"1","interior":{"X1": {"Parachain":"200100510"}}}';
		const registry = new Registry('statemine', {});

		const foreignAssetExistsInRegistry = foreignAssetMultiLocationIsInRegistry(
			mockSystemApi,
			multiLocation,
			registry
		);

		expect(foreignAssetExistsInRegistry).toEqual(expected);
	});

	it('Should throw an invalid character error when an invalid character is found in a multilocation keys value', () => {
		const expectedError =
			'Error creating MultiLocation type: Enum(Parachain) Invalid character';

		const multiLocation =
			'{"parents":"1","interior":{"X1": {"Parachain":"g2125"}}}';
		const registry = new Registry('statemine', {});

		const err = () =>
			foreignAssetMultiLocationIsInRegistry(
				mockSystemApi,
				multiLocation,
				registry
			);

		expect(err).toThrow(expectedError);
	});

	it('Should throw an error when an comma is found in a multilocation keys value', () => {
		const expectedError =
			'Error creating MultiLocation type: Enum(Parachain) String should not contain decimal points or scientific notation';

		const multiLocation =
			'{"parents":"2","interior":{"X1": {"Parachain":"2,125"}}}';
		const registry = new Registry('statemine', {});

		const err = () =>
			foreignAssetMultiLocationIsInRegistry(
				mockSystemApi,
				multiLocation,
				registry
			);

		expect(err).toThrow(expectedError);
	});
});
