// Copyright 2023 Parity Technologies (UK) Ltd.

import { isHex, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { BaseError, BaseErrorsEnum } from '../errors/index.js';
import { validateAddress } from '../validate/validateAddress.js';

/**
 * First validate the given address is valid, then ensure
 * it is converted and sanitized to it's public key.
 *
 * @param addr Either a SS58 address or the public key of an address
 */
export const sanitizeAddress = (addr: string): `0x${string}` => {
	const [isValid, msg] = validateAddress(addr);
	if (!isValid) {
		throw new BaseError(msg as string, BaseErrorsEnum.InvalidAddress);
	}
	// Verify that it is a valid hex public key
	if (isHex(addr)) return addr;

	const decoded = decodeAddress(addr);
	return u8aToHex(decoded);
};
