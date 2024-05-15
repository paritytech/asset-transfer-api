// Copyright 2024 Parity Technologies (UK) Ltd.

import { ASSETHUB_GLOBAL_CONSENSUS_LOCATIONS } from '../../consts';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { UnionXcmMultiLocation } from '../types';

export const getGlobalConsensusDestFromLocation = (locationStr: string): UnionXcmMultiLocation => {
	if (!locationStr.toLowerCase().includes('globalconsensus')) {
		throw new BaseError(
			`Bridge transaction location ${locationStr} must contain a valid GlobalConsensus Junction`,
			BaseErrorsEnum.InternalError,
		);
	}

	let assetLocation = JSON.parse(locationStr) as UnionXcmMultiLocation;

	if (assetLocation.interior && assetLocation.interior.X1) {
		const globalConsensusDestStr = JSON.stringify(assetLocation.interior.X1).toLowerCase().includes('polkadot')
			? ASSETHUB_GLOBAL_CONSENSUS_LOCATIONS['polkadot']
			: JSON.stringify(assetLocation.interior.X1).toLowerCase().includes('kusama')
			  ? ASSETHUB_GLOBAL_CONSENSUS_LOCATIONS['kusama']
			  : JSON.stringify(assetLocation.interior.X1).toLowerCase().includes('westend')
			    ? ASSETHUB_GLOBAL_CONSENSUS_LOCATIONS['westend']
			    : JSON.stringify(assetLocation.interior.X1).toLowerCase().includes('rococo')
			      ? ASSETHUB_GLOBAL_CONSENSUS_LOCATIONS['rococo']
			      : undefined;

		assetLocation = globalConsensusDestStr
			? (JSON.parse(globalConsensusDestStr) as UnionXcmMultiLocation)
			: assetLocation;
	} else {
		throw new BaseError(
			`Bridge transaction location interior ${JSON.stringify(
				assetLocation.interior,
			)} does not contain a GlobalConsensus Junction in the first index`,
			BaseErrorsEnum.InternalError,
		);
	}

	return assetLocation;
};
