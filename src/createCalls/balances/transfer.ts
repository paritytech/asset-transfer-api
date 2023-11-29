// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export const transfer = (
	api: ApiPromise,
	destAddr: string,
	amount: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	if (api.tx.balances.transferAllowDeath) {
		return api.tx.balances.transferAllowDeath(destAddr, amount);
	} else {
		return api.tx.balances.transfer(destAddr, amount);
	}
};
