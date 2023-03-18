// Copyright 2017-2023 Parity Technologies (UK) Ltd.
// This file is part of @substrate/asset-transfer-api.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import type { ApiPromise } from '@polkadot/api';
import type { Option, u32 } from '@polkadot/types';
import type { MultiLocation } from '@polkadot/types/interfaces';

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
export const fetchXcmVersion = async (
	api: ApiPromise,
	xcmVersion: number,
	multiLocation: MultiLocation,
	fallbackVersion: number
): Promise<number | u32> => {
	const supportedVersion = await api.query.polkadotXcm.supportedVersion<
		Option<u32>
	>(xcmVersion, multiLocation);

	if (supportedVersion.isNone) {
		const safeVersion = await api.query.polkadotXcm.safeXcmVersion<
			Option<u32>
		>();
		const version = safeVersion.isSome ? safeVersion.unwrap() : fallbackVersion;
		return version;
	}

	return supportedVersion.unwrap();
};
