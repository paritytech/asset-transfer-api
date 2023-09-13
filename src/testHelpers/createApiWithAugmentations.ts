// Copyright 2017-2023 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
//
// This has been converted from the original version which can be found here:
//
// https://github.com/polkadot-js/api/blob/v10.0.1/packages/api-derive/src/test/helpers.ts

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';

export function createApiWithAugmentations(metadataHex: `0x${string}`): ApiPromise {
	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, metadataHex);

	registry.setMetadata(metadata);

	const api = new ApiPromise({
		provider: new WsProvider('ws://', false),
		registry,
	});

	api.injectMetadata(metadata, true, registry);

	return api;
}
