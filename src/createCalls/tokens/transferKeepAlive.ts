import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transferKeepAlive = (
	api: ApiPromise,
	dest: string,
	currencyId: string,
	amount: string,
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	/**
	 * The ORML tokens pallets `tokens::transfer` accepts a `T::CurrencyId` value which can be many different types,
	 * in this case we are strictly applying `{ Token: <currency> }`;
	 */
	return api.tx.tokens.transferKeepAlive(dest, { Token: currencyId }, amount);
};
