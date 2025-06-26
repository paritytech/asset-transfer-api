import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { UnionXcmMultiLocation } from '../types.js';

export const parseLocationStrToLocation = (
	locationStr: string,
	xcmVersion: number = DEFAULT_XCM_VERSION,
): UnionXcmMultiLocation => {
	let location = '';
	const isX1V4Location = locationStr.includes(`X1":[`) && locationStr.includes(`]`);

	if (xcmVersion && xcmVersion === 3 && isX1V4Location) {
		location = locationStr.replace('[', '').replace(']', '');
	} else {
		location = locationStr;
	}

	try {
		return JSON.parse(location) as UnionXcmMultiLocation;
	} catch {
		throw new BaseError(`Unable to parse ${locationStr} as a valid location`, BaseErrorsEnum.InvalidInput);
	}
};
