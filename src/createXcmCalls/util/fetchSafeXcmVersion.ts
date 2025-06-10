// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Option, u32 } from '@polkadot/types';

import { DEFAULT_XCM_VERSION, SUPPORTED_XCM_VERSIONS } from '../../consts.js';
import { establishXcmPallet } from './establishXcmPallet.js';

/**
 * Fetch for a safe Xcm Version from the chain, if none exists the
 * in app default version will be used.
 *
 * @param api ApiPromise
 */
export const fetchSafeXcmVersion = async (api: ApiPromise): Promise<number> => {
	const pallet = establishXcmPallet(api);
	const safeVersion = await api.query[pallet].safeXcmVersion<Option<u32>>();
	const maxSupportedVersion = Math.max(...SUPPORTED_XCM_VERSIONS);
	const minSupportedVersion = Math.min(...SUPPORTED_XCM_VERSIONS);
	if (safeVersion.isSome) {
		const version = safeVersion.unwrap().toNumber();
		if (version < minSupportedVersion || version > maxSupportedVersion) {
			throw new Error(
				`XCM v${version} not supported by asset-transfer-api. Supported versions: [${SUPPORTED_XCM_VERSIONS.toString()}]`,
			);
		}
		return version;
	} else {
		return DEFAULT_XCM_VERSION;
	}
};
