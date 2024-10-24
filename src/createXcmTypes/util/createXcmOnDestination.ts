// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { UnionXcmMultiLocation } from '../types';

export const createXcmOnDestination = (
	assets: string[],
	beneficiary: UnionXcmMultiLocation,
	xcmVersion: number,
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

	const defaultDestXcm: AnyJson =
		xcmVersion === 3
			? {
					V3: xcmMessage,
				}
			: {
					V4: xcmMessage,
				};

	return defaultDestXcm;
};
