// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import type { Registry } from '../../registry';
import type { XcmDirection } from '../../types';

export type PolkadotXcmBaseArgs = {
	api: ApiPromise;
	direction: XcmDirection;
	destAddr: string;
	assetIds: string[];
	amounts: string[];
	destChainId: string;
	xcmVersion: number;
	specName: string;
	registry: Registry;
};
