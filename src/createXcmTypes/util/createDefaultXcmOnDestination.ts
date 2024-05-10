// Copyright 2024 Parity Technologies (UK) Ltd.

import type { AnyJson } from '@polkadot/types/types';

import { UnionXcmMultiLocation } from '../types';

export const createDefaultXcmOnDestination = (beneficiary: UnionXcmMultiLocation, xcmVersion: number): AnyJson => {
	const defaultDestXcm: AnyJson =
		xcmVersion === 3
			? {
					V3: [
						{
							depositAsset: {
								assets: {
									Wild: {
										AllCounted: 1,
									},
								},
								beneficiary,
							},
						},
					],
			  }
			: {
					V4: [
						{
							depositAsset: {
								assets: {
									Wild: {
										AllCounted: 1,
									},
								},
								beneficiary,
							},
						},
					],
			  };

	return defaultDestXcm;
};

// TODO: do we need to include BuyExecution?
// BuyExecution { fees: remote_fees, weight_limit: t.args.weight_limit.clone() },
