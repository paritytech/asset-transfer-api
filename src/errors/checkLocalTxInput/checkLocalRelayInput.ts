// Copyright 2023 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../BaseError';
import { LocalTxType } from './types';

export const checkLocalRelayInput = (assetIds: string[], amounts: string[]): LocalTxType => {
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
			BaseErrorsEnum.InvalidInput,
		);
	}

	return LocalTxType.Balances;
};
