// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetsTransferApi';
export * from './constructApiPromise';
export * from './types';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetsTransferApi } from './AssetsTransferApi';

const main = async () => {
    // const specName = 'bridge-hub-kusama';
    // const specname = 'statemine';
    // const provider = new WsProvider(`wss://kusama-asset-hub-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://statemine-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://kusama.api.encointer.org`);
    // const provider = new WsProvider(`wss://westend-asset-hub-rpc.polkadot.io`);
    // const provider = new WsProvider(`wss://wss.api.moonbeam.network`);
    // const provider = new WsProvider(`wss://sys.ibp.network/collectives-westend`);
    // const provider = new WsProvider('wss://invarch-tinkernet.api.onfinality.io/public-ws');
    // const provider = new WsProvider(`wss://moonriver.api.onfinality.io/public-ws`);
    const provider = new WsProvider(`wss://moonriver.public.blastapi.io`);

    const api = await ApiPromise.create({ provider });

    await api.isReady;

    const assetTransferApi = new AssetsTransferApi(api, 'moonriver', 2);
 
    const payload = await assetTransferApi.createTransferTransaction(
        '1000',
        'D3R6bYhvjhSfuQs68QvV3JUmFQf6DWgHqQVCFx4JXD253bk',
        [],
        ['5000000000'],
        {
            sendersAddr: 'D3R6bYhvjhSfuQs68QvV3JUmFQf6DWgHqQVCFx4JXD253bk',
            format: 'payload',
            xcmVersion: 3,
            isLimited: true,
            weightLimit: {
                refTime: '200000',
                proofSize: '10000'
            }
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
    process.exit();


    
};

main();
