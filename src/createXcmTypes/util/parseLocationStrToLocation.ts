// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../../errors';
import { UnionXcmMultiLocation } from '../types';

export const parseLocationStrToLocation = (locationStr: string): UnionXcmMultiLocation => {
	try {
		return JSON.parse(locationStr) as UnionXcmMultiLocation;
	} catch {
		throw new BaseError(`Unable to parse ${locationStr} as a valid location`, BaseErrorsEnum.InvalidInput);
	}
};
