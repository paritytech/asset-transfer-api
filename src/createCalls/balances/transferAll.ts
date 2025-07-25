import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transferAll = (
	api: ApiPromise,
	destAddr: string,
	keepAlive: boolean,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	return api.tx.balances.transferAll(destAddr, keepAlive);
};
