// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transferAll = (
	api: ApiPromise,
	assetId: string,
	destAddr: string,
	keepAlive: boolean,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.poolAssets.transferAll(assetId, destAddr, keepAlive);
};
