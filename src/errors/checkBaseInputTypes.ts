// Copyright 2023 Parity Technologies (UK) Ltd.

import { BaseError } from './BaseError';

export const checkBaseInputTypes = (
	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[]
) => {
	if (typeof destChainId !== 'string') {
		throw new BaseError(
			`'destChainId' must be a string. Received: ${typeof destChainId}`
		);
	}

	if (typeof destAddr !== 'string') {
		throw new BaseError(
			`'destAddr' must be a string. Received: ${typeof destAddr}`
		);
	}

	if (!Array.isArray(assetIds)) {
		throw new BaseError(
			`'assetIds' must be a array. Received: ${typeof assetIds}`
		);
	} else {
		for (let i = 0; i < assetIds.length - 1; i++) {
			if (typeof assetIds[i] !== 'string') {
				throw new BaseError(
					`All inputs in the 'assetIds' array must be strings: Received: a ${typeof assetIds[
						i
					]} at index ${i}`
				);
			}
		}
	}

	if (!Array.isArray(amounts)) {
		throw new BaseError(
			`'amounts' must be a array. Received: ${typeof assetIds}`
		);
	} else {
		for (let i = 0; i < amounts.length - 1; i++) {
			if (typeof amounts[i] !== 'string') {
				throw new BaseError(
					`All inputs in the 'amounts' array must be strings: Received: a ${typeof amounts[
						i
					]} at index ${i}`
				);
			}
		}
	}
};
