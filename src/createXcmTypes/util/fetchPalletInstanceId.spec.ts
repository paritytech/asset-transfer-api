// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstanceId', () => {
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId(mockSystemApi, false, false);

		expect(res).toEqual('50');
	});
	it('Should error when there is no Asset pallet available', () => {
		const mockApi = {
			registry: {
				metadata: {
					pallets: [{ name: 'NotAssets' }],
				},
			},
		} as unknown as ApiPromise;
		const res = () => fetchPalletInstanceId(mockApi, false, false);

		expect(res).toThrowError(
			"No Assets pallet available, can't find a valid PalletInstance."
		);
	});
	it('Should correctly grab the poolAssets pallet instance', () => {
		const res = fetchPalletInstanceId(mockSystemApi, true, false);

		expect(res).toEqual('55');
	});
	it('Should correctly grab the foreignAssets pallet instance', () => {
		const res = fetchPalletInstanceId(mockSystemApi, false, true);

		expect(res).toEqual('53');
	});
	it('Should correctly error when both foreign assets and pool assets are true', () => {
		const err = () => fetchPalletInstanceId(mockSystemApi, true, true);

		expect(err).toThrowError(
			"Can't find the appropriate pallet when both liquid tokens and foreign assets"
		);
	});
});
