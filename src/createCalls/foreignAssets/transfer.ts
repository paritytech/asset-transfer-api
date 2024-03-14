// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { UnionXcmMultiLocation } from '../../createXcmTypes/types';

export const transfer = (
	api: ApiPromise,
	destAddr: string,
	assetId: UnionXcmMultiLocation,
	amount: string,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	console.log('TRANSFER ASSET ID', JSON.stringify(assetId));
	return api.tx.foreignAssets.transfer(assetId, destAddr, amount);
};
