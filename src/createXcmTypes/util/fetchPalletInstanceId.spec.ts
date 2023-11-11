// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';

describe('fetchPalletInstanceId', () => {
	it('Should return the correct string when the api has the assets pallet', () => {
		const res = fetchPalletInstanceId(mockSystemApi, false, false);

		expect(res).toEqual('50');
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

		expect(err).toThrowError("Can't find the appropriate pallet when both liquid tokens and foreign assets");
	});
	it('Should correctly return an empty string when the assets pallet is not found', () => {
		const res = fetchPalletInstanceId(mockBifrostParachainApi, false, false);

		expect(res).toEqual('');
	});
});
