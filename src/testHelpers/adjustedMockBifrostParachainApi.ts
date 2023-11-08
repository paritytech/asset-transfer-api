import { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';
import { mockBifrostParachainApi } from './mockBifrostParachainApi';

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
		})
	);


const accountNextIndex = () => mockBifrostParachainApi.registry.createType('u32', 10);

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
        }
    },
    tx: {
        polkadotXcm: {
            limitedReserveTransferAssets: mockBifrostParachainApi.tx['polkadotXcm'].limitedReserveTransferAssets,
            reserveTransferAssets: mockBifrostParachainApi.tx['polkadotXcm'].reserveTransferAssets,
            teleportAssets: mockBifrostParachainApi.tx['polkadotXcm'].teleportAssets,
            limitedTeleportAssets: mockBifrostParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
        },
        xTokens: {
            transferMultiasset: mockBifrostParachainApi.tx['xTokens'].transferMultiasset,
            transferMultiassetWithFee: mockBifrostParachainApi.tx['xTokens'].transferMultiassetWithFee,
            transferMultiassets: mockBifrostParachainApi.tx['xTokens'].transferMultiassets,
        },
    },
    runtimeVersion: {
        transactionVersion: mockBifrostParachainApi.registry.createType('u32', 4),
        specVersion: mockBifrostParachainApi.registry.createType('u32', 2302),
    },
    genesisHash: mockBifrostParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
