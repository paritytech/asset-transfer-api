import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { SUPPORTED_XCM_VERSIONS } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { sanitizeKeys } from '../../util/sanitizeKeys.js';
import { XcmJunction, XcmMultiLocation } from '../types.js';

export function createParachainBeneficiary({
	accountId,
	destChainId,
	parents,
}: {
	accountId: string;
	destChainId: string;
	parents: number;
}): XcmMultiLocation {
	const chainId = Number(destChainId);
	if (isNaN(chainId)) {
		throw new BaseError('destChainId expected to be string representation of an integer', BaseErrorsEnum.InvalidInput);
	}
	const X2: [XcmJunction, XcmJunction] = isEthereumAddress(accountId)
		? [{ Parachain: chainId }, { AccountKey20: { key: accountId } }]
		: [{ Parachain: chainId }, { AccountId32: { id: accountId } }];
	return {
		parents,
		interior: { X2 },
	};
}

export function parseMultiLocation(input: AnyJson, xcmVersion: number): XcmMultiLocation {
	const multiLocationStr = typeof input === 'string' ? input : JSON.stringify(input);

	const isX1V4Location = multiLocationStr.includes(`X1":[`) && multiLocationStr.includes(`]`);
	let location = '';
	if (xcmVersion <= 3 && isX1V4Location) {
		location = multiLocationStr.replace('[', '').replace(']', '');
	} else {
		location = multiLocationStr;
	}

	const hasGlobalConsensus =
		multiLocationStr.includes('globalConsensus') || multiLocationStr.includes('GlobalConsensus');
	if (xcmVersion <= 2 && hasGlobalConsensus) {
		throw new BaseError(
			'XcmVersion must be greater than 2 for MultiLocations that contain a GlobalConsensus junction.',
			BaseErrorsEnum.InvalidXcmVersion,
		);
	}

	let multiLocation: XcmMultiLocation;
	try {
		multiLocation = JSON.parse(location) as XcmMultiLocation;
		validateXcmMultiLocation(multiLocation);
	} catch {
		throw new BaseError(`Unable to parse ${multiLocationStr} as a valid location`, BaseErrorsEnum.InvalidInput);
	}

	// handle case where result is an xcmV1Multilocation from the registry
	if (multiLocation && typeof multiLocation === 'object' && 'v1' in multiLocation) {
		multiLocation = multiLocation.v1 as XcmMultiLocation;
	}

	// This won't wrap X1s in arrays/tuples for xvmVersion >= 4
	// We can do that instead in resolveMultiLocation

	return sanitizeKeys(multiLocation);
}

/**
 * Return true if the input is a XcmMultiLocation or a MultiLocation variant.
 *
 * This is not exhaustive and is a bit messy.
 * The output may not actually be a XcmMultiLocation but
 * a MultiLocationVariant<J> instead. This dates back to
 * some historical string parsing.
 *
 * Ideally this is eventually removed altogether with the
 * removal of passing stringified multilocations around
 * to be interpretted.
 */
function validateXcmMultiLocation(obj: AnyJson): obj is XcmMultiLocation {
	const requiredKeys = ['parents', 'interior'];
	// We continue to support parsing of older version so we can't rely purely on SUPPORTED_XCM_VERSIONS
	const maxVersion = Math.max(...SUPPORTED_XCM_VERSIONS);
	const versions = Array.from({ length: maxVersion }, (_, i) => i);
	const versionLabels = versions.flatMap((v) => [`V${v}`, `v${v}`]);

	if (typeof obj === 'object' && obj !== null) {
		const lowerCaseKeys = Object.keys(obj).map((k) => k.toLowerCase());
		const objRecord = obj as { [key: string]: AnyJson };

		// Check if XcmMultiVersion: wrapped in V{xcmVersion}
		const versionKeys = versionLabels.filter((key) => key in objRecord);
		if (versionKeys.length === 1) {
			const matchedKey = versionKeys[0];
			return validateXcmMultiLocation(objRecord[matchedKey]);
		} else if (versionKeys.length > 1) {
			throw new BaseError(`Unable to parse ${JSON.stringify(obj)} as a valid location`, BaseErrorsEnum.InvalidInput);
		}

		// Check if MultiLocationVariant
		if (requiredKeys.every((key) => lowerCaseKeys.includes(key))) {
			return true;
		}
	}
	throw new BaseError(`Unable to parse ${JSON.stringify(obj)} as a valid location`, BaseErrorsEnum.InvalidInput);
}
