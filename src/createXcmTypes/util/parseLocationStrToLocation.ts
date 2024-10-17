// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { UnionXcmMultiLocation } from '../types.js';

export const parseLocationStrToLocation = (locationStr: string): UnionXcmMultiLocation => {
	try {
		return JSON.parse(locationStr) as UnionXcmMultiLocation;
	} catch {
		throw new BaseError(`Unable to parse ${locationStr} as a valid location`, BaseErrorsEnum.InvalidInput);
	}
};
