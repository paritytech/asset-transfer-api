import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Call, Extrinsic, Header } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { mockHydrationParachainApi } from './mockHydrationParachainApi';
import { mockWeightInfo } from './mockWeightInfo';

const queryInfoCallAt = () =>
	Promise.resolve().then(() => mockHydrationParachainApi.createType('RuntimeDispatchInfoV2', mockWeightInfo));
const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockHydrationParachainApi.registry.createType('Option<u32>', 2);
	});

const getParachainRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockHydrationParachainApi.registry.createType('Text', 'hydradx'),
			specVersion: mockHydrationParachainApi.registry.createType('u32', 2302),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockHydrationParachainApi.registry.createType('Header', {
			number: mockHydrationParachainApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockHydrationParachainApi.registry.createType('Hash'),
			stateRoot: mockHydrationParachainApi.registry.createType('Hash'),
			extrinsicsRoot: mockHydrationParachainApi.registry.createType('Hash'),
			digest: mockHydrationParachainApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockHydrationParachainApi.registry.createType('u32', 10);
const mockSubmittableExt = mockHydrationParachainApi.registry.createType(
	'Extrinsic',
	'0x49010446010401020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20013000064a7b3b6e00d04010200a10f0100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300',
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

export const adjustedmockHydrationParachainApi = {
	registry: mockHydrationParachainApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getParachainRuntimeVersion,
		},
		system: {
			accountNextIndex: accountNextIndex,
		},
		chain: {
			getHeader: getHeader,
		},
	},
	query: {
		polkadotXcm: {
			safeXcmVersion: getSystemSafeXcmVersion,
		},
		parachainInfo: {
			parachainId: () => Promise.resolve('2034'),
		},
	},
	tx: Object.assign(
		(_extrinsic: Call | Extrinsic | Uint8Array | string) => {
			return mockSubmittableExt;
		},
		{
			polkadotXcm: {
				limitedReserveTransferAssets: mockHydrationParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
				reserveTransferAssets: mockHydrationParachainApi.tx['polkadotXcm'].reserveTransferAssets,
				teleportAssets: mockHydrationParachainApi.tx['polkadotXcm'].teleportAssets,
				limitedTeleportAssets: mockHydrationParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
				transferAssets: mockHydrationParachainApi.tx['polkadotXcm'].transferAssets,
				transferAssetsUsingTypeAndThen: mockHydrationParachainApi.tx['polkadotXcm'].transferAssetsUsingTypeAndThen,
			},
			xTokens: {
				transferMultiasset: mockHydrationParachainApi.tx['xTokens'].transferMultiasset,
				transferMultiassetWithFee: mockHydrationParachainApi.tx['xTokens'].transferMultiassetWithFee,
				transferMultiassets: mockHydrationParachainApi.tx['xTokens'].transferMultiassets,
			},
		},
	),
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
	runtimeVersion: {
		transactionVersion: mockHydrationParachainApi.registry.createType('u32', 4),
		specVersion: mockHydrationParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockHydrationParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
