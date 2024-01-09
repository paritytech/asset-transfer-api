// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { UnionXcmMultiLocation } from '../../createXcmTypes/types';

export const transferKeepAlive = (
	api: ApiPromise,
	destAddr: string,
	assetId: UnionXcmMultiLocation,
	amount: string,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.foreignAssets.transferKeepAlive(assetId, destAddr, amount);
};
