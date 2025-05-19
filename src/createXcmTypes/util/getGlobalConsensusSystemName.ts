// Copyright 2024 Parity Technologies (UK) Ltd.

import { KNOWN_GLOBAL_CONSENSUS_SYSTEM_NAMES } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { parseLocationStrToLocation } from './parseLocationStrToLocation.js';

export const getGlobalConsensusSystemName = (destLocation: string): string => {
	const location = parseLocationStrToLocation(destLocation);

	for (const systemName of KNOWN_GLOBAL_CONSENSUS_SYSTEM_NAMES) {
		if (
			(location.interior.X1 && JSON.stringify(location.interior.X1).toLowerCase().includes(systemName)) ||
			(location.interior.X2 && JSON.stringify(location.interior.X2).toLowerCase().includes(systemName))
		) {
			return systemName;
		}
	}

	throw new BaseError(
		`No known consensus system found for location ${destLocation}`,
		BaseErrorsEnum.UnknownConsensusSystem,
	);
};
