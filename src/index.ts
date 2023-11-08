// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {
    // const specName = 'bridge-hub-kusama';
    // const specname = 'statemine';
    // const provider = new WsProvider(`wss://kusama-asset-hub-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://statemine-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://kusama.api.encointer.org`);
    // const provider = new WsProvider(`wss://westend-asset-hub-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://wss.api.moonbeam.network`);
    // const provider = new WsProvider(`wss://sys.ibp.network/collectives-westend`);
    // 'wss://moonriver.api.onfinality.io/public-ws'
    const provider = new WsProvider(
        // `wss://moonriver.api.onfinality.io/public-ws`
        // `wss://bifrost-parachain.api.onfinality.io/public-ws`
        `wss://bifrost-rpc.dwellir.com`
    );

    const api = await ApiPromise.create({ provider });

    await api.isReady;

    const assetTransferApi = new AssetTransferApi(api, 'bifrost', 2);

    const payload = await assetTransferApi.createTransferTransaction(
        '2023',
        '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
        ['vbnc'],
        ['2000000000'],
        {
            format: 'payload',
            xcmVersion: 2,
            isLimited: false,
            sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
        }
    );

    console.log('payload', JSON.stringify(payload));

    const decodedPayload = assetTransferApi.decodeExtrinsic(
        payload.tx,
        'payload'
    );
    console.log('decodedPayload', decodedPayload);

    const payloadExtrinsic = api.registry.createType(
        'ExtrinsicPayload',
        payload.tx,
        {
            version: 4,
        }
    );

    console.log(
        'payload method to string',
        JSON.stringify(payloadExtrinsic.method.toHuman())
    );
    const payloadJSON = payloadExtrinsic.method.toJSON();
    console.log('payload json', payloadJSON);
};

main();

