// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Option, u32 } from '@polkadot/types';
import { establishXcmPallet } from './establishXcmPallet';
import { DEFAULT_XCM_VERSION } from '../../consts';

/**
 * TODO: When we are actively using this change it over to `private`.
 * TODO: Should this be moved because we wont have the MultiLocation until we pass this
 * into the typecreation.
 *
 * Fetch the xcmVersion to use for a given chain. If the supported version doesn't for
 * a given destination we use the on storage safe version.
 *
 * @param xcmVersion The version we want to see is supported
 * @param multiLocation Destination multilocation
 */
	/**
	 * Fetch for a safe Xcm Version from the chain, if none exists the
	 * in app default version will be used.
	 */
	export const fetchSafeXcmVersion = async (api: ApiPromise): Promise<u32> => {
		const pallet = establishXcmPallet(api);
		const safeVersion = await api.query[pallet].safeXcmVersion<Option<u32>>();
		const version = safeVersion.isSome
			? safeVersion.unwrap()
			: api.registry.createType('u32', DEFAULT_XCM_VERSION);

		return version;
	}
