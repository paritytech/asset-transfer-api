// Copyright 2023 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from './BaseError';

/**
 * Check the base types for the inputs for createTransferTransaction
 *
 * @param destChainId
 * @param destAddr
 * @param assetIds
 * @param amounts
 */
export const checkBaseInputTypes = (destChainId: string, destAddr: string, assetIds: string[], amounts: string[]) => {
    if (typeof destChainId !== 'string') {
        throw new BaseError(`'destChainId' must be a string. Received: ${typeof destChainId}`, BaseErrorsEnum.InvalidInput);
    }

    if (typeof destAddr !== 'string') {
        throw new BaseError(`'destAddr' must be a string. Received: ${typeof destAddr}`, BaseErrorsEnum.InvalidInput);
    }

    if (!Array.isArray(assetIds)) {
        throw new BaseError(`'assetIds' must be an array. Received: ${typeof assetIds}`, BaseErrorsEnum.InvalidInput);
    } else {
        for (let i = 0; i < assetIds.length; i++) {
            if (typeof assetIds[i] !== 'string') {
                throw new BaseError(
                    `All inputs in the 'assetIds' array must be strings: Received: a ${typeof assetIds[i]} at index ${i}`,
                    BaseErrorsEnum.InvalidInput,
                );
            }
        }
    }

    if (!Array.isArray(amounts)) {
        throw new BaseError(`'amounts' must be an array. Received: ${typeof amounts}`, BaseErrorsEnum.InvalidInput);
    } else {
        for (let i = 0; i < amounts.length; i++) {
            if (typeof amounts[i] !== 'string') {
                throw new BaseError(
                    `All inputs in the 'amounts' array must be strings: Received: a ${typeof amounts[i]} at index ${i}`,
                    BaseErrorsEnum.InvalidInput,
                );
            }
        }
    }
};
