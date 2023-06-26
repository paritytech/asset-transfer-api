// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { mockParachainApi } from './mockParachainApi';

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockParachainApi.registry.createType('Option<u32>', 2);
	});

export const adjustedMockParachainApi = {
	query: {
		polkadotXcm: {
			safeXcmVersion: getSystemSafeXcmVersion,
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets:
				mockParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockParachainApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockParachainApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
	},
} as unknown as ApiPromise;
