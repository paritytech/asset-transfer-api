import { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Call, Extrinsic, Header } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { mockBifrostParachainApi } from './mockBifrostParachainApi';
import { mockWeightInfo } from './mockWeightInfo';

const queryInfoCallAt = () =>
	Promise.resolve().then(() => mockBifrostParachainApi.createType('RuntimeDispatchInfoV2', mockWeightInfo));
const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockBifrostParachainApi.registry.createType('Option<u32>', 2);
	});

const getParachainRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockBifrostParachainApi.registry.createType('Text', 'bifrost'),
			specVersion: mockBifrostParachainApi.registry.createType('u32', 2302),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockBifrostParachainApi.registry.createType('Header', {
			number: mockBifrostParachainApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockBifrostParachainApi.registry.createType('Hash'),
			stateRoot: mockBifrostParachainApi.registry.createType('Hash'),
			extrinsicsRoot: mockBifrostParachainApi.registry.createType('Hash'),
			digest: mockBifrostParachainApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockBifrostParachainApi.registry.createType('u32', 10);
const mockSubmittableExt = mockBifrostParachainApi.registry.createType(
	'Extrinsic',
	'0x49010446010401020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20013000064a7b3b6e00d04010200a10f0100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300',
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

export const adjustedMockBifrostParachainApi = {
	registry: mockBifrostParachainApi.registry,
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
	},
	tx: Object.assign(
		(_extrinsic: Call | Extrinsic | Uint8Array | string) => {
			return mockSubmittableExt;
		},
		{
			polkadotXcm: {
				limitedReserveTransferAssets: mockBifrostParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
				reserveTransferAssets: mockBifrostParachainApi.tx['polkadotXcm'].reserveTransferAssets,
				teleportAssets: mockBifrostParachainApi.tx['polkadotXcm'].teleportAssets,
				limitedTeleportAssets: mockBifrostParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
				transferAssets: mockBifrostParachainApi.tx['polkadotXcm'].transferAssets,
			},
			xTokens: {
				transferMultiasset: mockBifrostParachainApi.tx['xTokens'].transferMultiasset,
				transferMultiassetWithFee: mockBifrostParachainApi.tx['xTokens'].transferMultiassetWithFee,
				transferMultiassets: mockBifrostParachainApi.tx['xTokens'].transferMultiassets,
			},
		},
	),
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
	runtimeVersion: {
		transactionVersion: mockBifrostParachainApi.registry.createType('u32', 4),
		specVersion: mockBifrostParachainApi.registry.createType('u32', 2302),
	},
	genesisHash: mockBifrostParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
