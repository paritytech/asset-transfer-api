// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { BaseError, BaseErrorsEnum } from '../BaseError.js';
import { LocalTxType } from './types.js';

export const checkLocalParachainInput = (api: ApiPromise, assetIds: string[], amounts: string[]): LocalTxType => {
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
			BaseErrorsEnum.InvalidInput,
		);
	}

	if (assetIds.length === 0) {
		// If no asset is inputted, the chains native asset will be transferred.
		return LocalTxType.Balances;
	} else {
		if (!api.tx.tokens) {
			throw new BaseError(
				'Given the inputted assets, no Tokens pallet was found for a local transfer.',
				BaseErrorsEnum.PalletNotFound,
			);
		}
		return LocalTxType.Tokens;
	}
};
