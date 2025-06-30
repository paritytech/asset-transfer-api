import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { XcmMultiLocation } from '../../createXcmTypes/types.js';

export const transferAll = (
	api: ApiPromise,
	assetId: XcmMultiLocation,
	destAddr: string,
	keepAlive: boolean,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.foreignAssets.transferAll(assetId, destAddr, keepAlive);
};
