// Copyright 2024 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';

// import { hexToU8a} from '@polkadot/util';
// import type { ExtrinsicPayloadValue } from '@polkadot/types/types';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {
    // const provider = new WsProvider(`wss://bifrost-polkadot-rpc.dwellir.com/ws`);
    // const provider = new WsProvider(`wss://hydradx-rpc.dwellir.com`);
    // const provider = new WsProvider('wss://asset-hub-polkadot-rpc.dwellir.com');
    const provider = new WsProvider('wss://asset-hub-polkadot-rpc.dwellir.com');


    const api = await ApiPromise.create({ provider });

    await api.isReady;

    const assetTransferApi = new AssetTransferApi(api, 'asset-hub-polkadot', 4, 
    // {
    //    injectedRegistry: {
    //     polkadot: {
    //         2034: {
    //             xcAssetsData: [
    //                 {
    //                     "symbol": "WETH.snow",
    //                     "xcmV1MultiLocation": "{\"v1\":{\"parents\":2,\"interior\":{\"x2\":[{\"globalConsensus\":{\"ethereum\":{\"chainId\":1}}},{\"accountKey20\":{\"network\":null,\"key\":\"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\"}}]}}}",
    //              },
    //             ]
    //         }
    //     }
    //    }
    // }
);



    const payload = await assetTransferApi.createTransferTransaction(
        '2004',
        // `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`,
        '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B', // dest address
        ['DOT'],
        ['10000000000000'],
        {
            sendersAddr: '7KqMfyEXGMAgkNGxiTf3PNgKqSH1WNghbAGLKezYyLLW4Zp1',
            format: 'payload',
            xcmVersion: 3,
            paysWithFeeDest: 'DOT',
        },
    );

    const executionResult = await assetTransferApi.dryRunCall('7KqMfyEXGMAgkNGxiTf3PNgKqSH1WNghbAGLKezYyLLW4Zp1', payload.tx, 'payload');
    console.log("EXECUTION RESULT---", JSON.stringify(executionResult))

    console.log('payload', JSON.stringify(payload));

    const decodedPayload = assetTransferApi.decodeExtrinsic(payload.tx.toString(), 'payload');
    console.log('decodedPayload', decodedPayload);
};

main();
