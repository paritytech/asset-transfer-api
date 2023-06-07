// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Option, u32 } from '@polkadot/types';

import { DEFAULT_XCM_VERSION } from '../../consts';
import { establishXcmPallet } from './establishXcmPallet';

/**
 * Fetch for a safe Xcm Version from the chain, if none exists the
 * in app default version will be used.
 *
 * @param api ApiPromise
 */
export const fetchSafeXcmVersion = async (api: ApiPromise): Promise<u32> => {
	const pallet = establishXcmPallet(api);
	const safeVersion = await api.query[pallet].safeXcmVersion<Option<u32>>();
	const version = safeVersion.isSome
		? safeVersion.unwrap()
		: api.registry.createType('u32', DEFAULT_XCM_VERSION);

	return version;
};
