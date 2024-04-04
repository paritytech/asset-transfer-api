// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';


import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {

const provider = new WsProvider(`wss://westend-asset-hub-rpc.polkadot.io`);
const api = await ApiPromise.create({ provider });
    await api.isReady;
    const assetTransferApi = new AssetTransferApi(api, 'westmint', 3);

    const payload = await assetTransferApi.claimAssets(
        [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`],
        ['1000'],
        '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
        4,
    );

    console.log('payload', JSON.stringify(payload));

    const decodedPayload = assetTransferApi.decodeExtrinsic(payload.tx.toString(), 'payload');
    console.log('decodedPayload', decodedPayload);

    const payloadExtrinsic = api.registry.createType('ExtrinsicPayload', payload.tx, {
        version: 4,
    });

    console.log('payload method to string', JSON.stringify(payloadExtrinsic.method.toHuman()));
    const payloadJSON = payloadExtrinsic.method.toJSON();
    console.log('payload json', payloadJSON);
}

main();
