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

/**
 * This fetches the metadata for the chain we are connected to and searches for the Assets pallet and returns its index.
 *
 * @param api ApiPromise
 */
export const fetchPalletInstanceId = (api: ApiPromise): string => {
	const assetsPallet = api.registry.metadata.pallets.filter(
		(pallet) => pallet.name.toString() === 'Assets'
	);

	if (assetsPallet.length === 0) {
		throw Error(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	}

	return assetsPallet[0].index.toString();
};
