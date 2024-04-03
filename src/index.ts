// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';


import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {

const provider = new WsProvider(`wss://kusama-asset-hub-rpc.polkadot.io`);
const api = await ApiPromise.create({ provider });
    await api.isReady;
    const assetTransferApi = new AssetTransferApi(api, 'statemine', 3);

    const payload = await assetTransferApi.claimAssets(

    )

    // console.log('payload', JSON.stringify(payload));

    // const decodedPayload = assetTransferApi.decodeExtrinsic(payload.tx.toHex(), 'payload');
    // console.log('decodedPayload', decodedPayload);

    // const payloadExtrinsic = api.registry.createType('ExtrinsicPayload', payload.tx, {
    //     version: 4,
    // });

    // console.log('payload method to string', JSON.stringify(payloadExtrinsic.method.toHuman()));
    // const payloadJSON = payloadExtrinsic.method.toJSON();
    // console.log('payload json', payloadJSON);
}

main();
