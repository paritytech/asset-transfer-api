// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { constructForeignAssetMultiLocationFromAssetId } from './constructForeignAssetMultiLocationFromAssetId';

describe('constructForeignAssetMultiLocationFromAssetId', () => {
	it('Should correctly construct a multilocation given a multilocation assetId', () => {
		const assetId = `{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}`;
		const foreignAssetsPalletInstance = '53';

		const expectedMultiLocation = mockSystemApi.registry.createType('XcmV2MultiLocation', {
			parents: 1,
			interior: mockSystemApi.registry.createType('InteriorMultiLocation', {
				X3: [{ PalletInstance: 53 }, { Parachain: 2125 }, { GeneralIndex: 0 }],
			}),
		});

		const multiLocation = constructForeignAssetMultiLocationFromAssetId(
			mockSystemApi,
			assetId,
			foreignAssetsPalletInstance,
			2
		);

		expect(JSON.stringify(multiLocation)).toEqual(JSON.stringify(expectedMultiLocation));
	});
});
