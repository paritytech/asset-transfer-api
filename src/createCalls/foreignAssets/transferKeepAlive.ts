import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { UnionXcmMultiLocation } from '../../createXcmTypes/types.js';

export const transferKeepAlive = (
	api: ApiPromise,
	destAddr: string,
	assetId: UnionXcmMultiLocation,
	amount: string,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.foreignAssets.transferKeepAlive(assetId, destAddr, amount);
};
