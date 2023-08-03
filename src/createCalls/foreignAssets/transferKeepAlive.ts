// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { MultiLocation } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transferKeepAlive = (
	api: ApiPromise,
	destAddr: string,
	assetId: MultiLocation,
	amount: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.foreignAssets.transferKeepAlive(assetId, destAddr, amount);
};
