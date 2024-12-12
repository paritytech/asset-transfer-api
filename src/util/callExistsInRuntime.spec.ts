// Copyright 2024 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../AssetTransferApi';
import { adjustedMockBifrostParachainApi } from '../testHelpers/adjustedMockBifrostParachainApi';
import { adjustedMockRelayApiNoLimitedReserveTransferAssets } from '../testHelpers/adjustedMockRelayApiNoLimitedReserveTransferAssets';
import { callExistsInRuntime } from './callExistsInRuntime';

describe('callExistsInRuntime', () => {
	it('Correctly returns false when a selected runtime call is not found in the provided runtime', () => {
		const relayAssetsApiNoLimitedReserveTransferAssets = new AssetTransferApi(
			adjustedMockRelayApiNoLimitedReserveTransferAssets,
			'kusama',
			2,
			{ registryType: 'NPM' },
		);
		const runtimeCall = 'limitedReserveAssetsTransfer';
		const xcmPalletName = 'xcmPallet';

		expect(callExistsInRuntime(relayAssetsApiNoLimitedReserveTransferAssets.api, runtimeCall, xcmPalletName)).toEqual(
			false,
		);
	});
	it('Correctly returns true when a selected runtime call is found in the provided runtime', () => {
		const bifrostAssetsApi = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 2, {
			registryType: 'NPM',
		});
		const runtimeCall = 'transferMultiasset';
		const xcmPalletName = 'xTokens';

		expect(callExistsInRuntime(bifrostAssetsApi.api, runtimeCall, xcmPalletName)).toEqual(true);
	});
});
