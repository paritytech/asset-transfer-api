import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transfer = (
	api: ApiPromise,
	destAddr: string,
	assetId: string,
	amount: string,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.assets.transfer(assetId, destAddr, amount);
};
