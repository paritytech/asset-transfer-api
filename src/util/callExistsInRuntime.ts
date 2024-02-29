// Copyright 2024 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

export const callExistsInRuntime = (api: ApiPromise, runtimeCall: string, xcmPalletName: string): boolean => {
	const availableRuntimeCalls = Object.keys(api.tx[xcmPalletName]).map((call) => call);

	return availableRuntimeCalls.indexOf(runtimeCall) != -1;
};
