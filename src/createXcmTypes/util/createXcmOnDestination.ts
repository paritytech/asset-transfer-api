// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { DEFAULT_XCM_VERSION } from '../../consts.js';
import { BaseError, BaseErrorsEnum } from '../../errors/BaseError.js';
import { UnionXcmMultiLocation } from '../types.js';

export const createXcmOnDestination = (
	assets: string[],
	beneficiary: UnionXcmMultiLocation,
	xcmVersion: number = DEFAULT_XCM_VERSION,
	customXcmOnDest?: string,
): AnyJson => {
	const xcmMessage: AnyJson = customXcmOnDest
		? (JSON.parse(customXcmOnDest) as AnyJson)
		: [
				{
					depositAsset: {
						assets: {
							Wild: {
								AllCounted: assets.length,
							},
						},
						beneficiary,
					},
				},
			];

	switch (xcmVersion) {
		// xcm V2 was explicitly not supported previously
		case 3:
			return { V3: xcmMessage };
		case 4:
			return { V4: xcmMessage };
		case 5:
			return { V5: xcmMessage };
		default:
			throw new BaseError(`XCM version ${xcmVersion} not supported.`, BaseErrorsEnum.InvalidXcmVersion);
	}
};
