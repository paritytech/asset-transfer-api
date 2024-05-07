// Copyright 2024 Parity Technologies (UK) Ltd.

export * from './AssetTransferApi';
export * from './constructApiPromise';
export * from './types';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetTransferApi } from './AssetTransferApi';

const main = async () => {
    const provider = new WsProvider(`wss://rococo-asset-hub-rpc.polkadot.io`);
    const api = await ApiPromise.create({ provider });
    await api.isReady;
    const assetTransferApi = new AssetTransferApi(api, 'asset-hub-rococo', 4);

    const payload = await assetTransferApi.createTransferTransaction(
        `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId
        '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B', // destAddress
        [
            `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`, // Snowbridge Sepolia WETH location 
        ],
        ['1000000000000'],
        {
            sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
            format: 'payload',
            xcmVersion: 4,
            paysWithFeeDest: '{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}',
            assetTransferType: 'RemoteReserve',
            remoteReserveAssetTransferTypeLocation: `{"RemoteReserve":{"V4":{"parents":"1","interior":{"X1":[{"Parachain":"1000"}]}}}}`,
            feesTransferType: 'RemoteReserve',
            remoteReserveFeesTransferTypeLocation: `{"RemoteReserve":{"V4":{"parents":"1","interior":{"X1":[{"Parachain":"1000"}]}}}}`
        }
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
};

main();
