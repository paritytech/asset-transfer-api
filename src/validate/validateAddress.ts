// Copyright 2023 Parity Technologies (UK) Ltd.

import { hexToU8a, isHex } from '@polkadot/util';
import {
	base58Decode,
	checkAddressChecksum,
	encodeAddress,
} from '@polkadot/util-crypto';
import { defaults } from '@polkadot/util-crypto/address/defaults';

/**
 * Verify that an address is a valid substrate address.
 *
 * Note: this is very similar '@polkadot/util-crypto/address/checkAddress,
 * except it does not check the ss58 prefix.
 *
 * @param address potential ss58 or raw address
 */
export const validateAddress = (
	address: string
): [boolean, string | undefined] => {
	let u8Address;
	if (isHex(address)) {
		u8Address = base58Decode(encodeAddress(hexToU8a(address)));
	} else {
		try {
			u8Address = base58Decode(address);
		} catch (error) {
			return [false, (error as Error).message];
		}
	}

	if (defaults.allowedEncodedLengths.includes(u8Address.length)) {
		const [isValid] = checkAddressChecksum(u8Address);

		return [isValid, isValid ? undefined : 'Invalid decoded address checksum'];
	}

	return [false, 'Invalid address format'];
};
