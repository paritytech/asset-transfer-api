// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';


import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {

const provider = new WsProvider(`wss://westend-rpc.polkadot.io`);
const api = await ApiPromise.create({ provider });
    await api.isReady;
    const assetTransferApi = new AssetTransferApi(api, 'westend', 3);

    const payload = await assetTransferApi.createTransferTransaction(
        '1000',
        '5HBuLJz9LdkUNseUEL6DLeVkx2bqEi6pQr8Ea7fS4bzx7i7E',
        ['wnd'],
        ['20000000000000'],
        {
            format: 'payload',
            xcmVersion: 3,
            isLimited: true,
            sendersAddr: '5G98qegMrs9jDqiopjondgMT2khFyUE46AjgULcxMr77Srbb',
        },
    );

    console.log('payload', JSON.stringify(payload));

    const decodedPayload = assetTransferApi.decodeExtrinsic(payload.tx, 'payload');
    console.log('decodedPayload', decodedPayload);

    const payloadExtrinsic = api.registry.createType('ExtrinsicPayload', payload.tx, {
        version: 4,
    });

    console.log('payload method to string', JSON.stringify(payloadExtrinsic.method.toHuman()));
    const payloadJSON = payloadExtrinsic.method.toJSON();
    console.log('payload json', payloadJSON);
}

main();
