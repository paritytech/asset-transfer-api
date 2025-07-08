import { KNOWN_GLOBAL_CONSENSUS_SYSTEM_NAMES } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { XcmCreator } from '../types.js';

export const getGlobalConsensusSystemName = ({
	destLocation,
	xcmCreator,
}: {
	destLocation: string;
	xcmCreator: XcmCreator;
}): string => {
	const location = xcmCreator.resolveMultiLocation(destLocation);

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
