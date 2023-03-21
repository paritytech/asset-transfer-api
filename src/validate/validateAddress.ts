// Copyright 2017-2023 Parity Technologies (UK) Ltd.
// This file is part of @substrate/asset-transfer-api.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
