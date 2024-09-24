// Copyright 2024 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { UnionXcmMultiLocation } from '../../createXcmTypes/types';

export const transferAll = (
	api: ApiPromise,
	assetId: UnionXcmMultiLocation,
	destAddr: string,
	keepAlive: boolean,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.foreignAssets.transferAll(assetId, destAddr, keepAlive);
};
