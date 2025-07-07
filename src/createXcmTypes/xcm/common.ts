import { AnyJson } from '@polkadot/types-codec/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

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
