// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { BaseError, BaseErrorsEnum } from '../../errors';
import { InteriorKey, InteriorValue, UnionXcmMultiLocation } from '../types';

export const getGlobalConsensusDestFromAssetLocation = (
	assetLocationStr: string,
	xcmVersion: number,
): InteriorValue => {
	if (!assetLocationStr.toLowerCase().includes('globalconsensus')) {
		throw new BaseError(
			`Bridge transaction asset location ${assetLocationStr} does not contain a GlobalConsensus Junction`,
			BaseErrorsEnum.InternalError,
		);
	}

	const assetLocation = JSON.parse(assetLocationStr) as UnionXcmMultiLocation;
	let globalConsensusDest: AnyJson | undefined;

	if (assetLocation.interior.X1) {
		globalConsensusDest = assetLocation.interior.X1;
	} else {
		const interiorJunctionKey = Object.keys(assetLocation.interior)[0];
		globalConsensusDest = (assetLocation.interior[interiorJunctionKey] as InteriorKey)[0];

		if (!JSON.stringify(globalConsensusDest).toLowerCase().includes('globalconsensus')) {
			throw new BaseError(
				`Bridge transaction asset location interior ${JSON.stringify(
					assetLocation.interior,
				)} does not contain a GlobalConsensus Junction in the first index`,
				BaseErrorsEnum.InternalError,
			);
		}
	}

	if (xcmVersion < 4) {
		return globalConsensusDest as InteriorValue;
	} else {
		return globalConsensusDest as InteriorValue;
	}
};
