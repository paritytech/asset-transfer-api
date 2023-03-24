// Copyright 2023 Parity Technologies (UK) Ltd.

import { BaseError } from './BaseError';

/**
 * Check a local transactions inputs to ensure they are correct.
 * If there is an issue it will throw a descriptive message.
 *
 * @param assetIds
 * @param amounts
 */
export const checkLocalTxInput = (assetIds: string[], amounts: string[]) => {
	// Ensure the lengths in assetIds and amounts is correct
	if (assetIds.length !== 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	}
};
