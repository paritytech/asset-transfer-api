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

import { ApiPromise } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { WsProvider } from '@polkadot/rpc-provider';

/**
 * Construct an Polkadot-js Api-Promise
 *
 * @param wsUrl WebSocket Url to connect to.
 * @param opts ApiOptions
 */
export const constructApiPromise = async (
	wsUrl: string,
	opts: ApiOptions = {}
): Promise<ApiPromise> => {
	return await ApiPromise.create({
		provider: new WsProvider(wsUrl),
		noInitWarn: true,
		...opts,
	});
};
