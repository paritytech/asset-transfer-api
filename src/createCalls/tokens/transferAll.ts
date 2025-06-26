import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transferAll = (
	api: ApiPromise,
	destAddr: string,
	currencyId: string,
	keepAlive: boolean,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	/**
	 * The ORML tokens pallets `tokens::transferAll` accepts a `T::CurrencyId` value which can be many different types,
	 * in this case we are strictly applying `{ Token: <currency> }`;
	 */
	return api.tx.tokens.transferAll(destAddr, { Token: currencyId }, keepAlive);
};
