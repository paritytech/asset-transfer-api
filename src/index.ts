// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetsTransferApi';
export * from './constructApiPromise';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AssetsTransferApi } from './AssetsTransferApi';
import { VersionedMultiLocation } from '@capi/polkadot/types/xcm/mod';

type DecodedExtrinsic = {
    callIndex: string,
    args: XCMInfo
}

type XCMInfo = {
    dest: VersionedMultiLocation,
    benificiary: VersionedMultiLocation,
    assets: VersionedMultiLocation,
    fee_asset_item: string,
}


const main = async () => {
    const provider = new WsProvider('wss://statemine-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider });

    await api.isReady;

    const assetTransferApi = new AssetsTransferApi(api);

    // call
    const call = await assetTransferApi.createTransferTransaction(
        '0', // destChainId
        '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
        [], // assetIds
        ['10000000000000'], // amounts
        {
            format: 'call',
            keepAlive: true
        } // opts
    );
    console.log('call is', call);
    const callExtrinsic = api.registry.createType('Call', call.tx);
    console.log('call to human', callExtrinsic.toString());
    const decoded1: DecodedExtrinsic = JSON.parse(callExtrinsic.toString());
    console.log('decoded1', decoded1);



//   // payload
//   const payload = await assetTransferApi.createTransferTransaction(
//     '0', // destChainId
//     '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
//     [], // assetIds
//     ['250000000000000'], // amounts
//     {
//         keepAlive: true
//     } // opts
//     );
//     console.log('payload is', payload);

//     const payloadExtrinsic = api.registry.createType('ExtrinsicPayload', payload.tx, {
//         version: 4
//     });

//     console.log('payload method to string', payloadExtrinsic.method.toHuman()?.toString());
//     const payloadJSON = payloadExtrinsic.method.toHuman() as string;
//     console.log('payload json', payloadJSON);
//     const decoded2: DecodedExtrinsic = JSON.parse(payloadJSON);
//     console.log('decoded2', JSON.stringify(decoded2));

  // submittable
//   const submittable = await assetTransferApi.createTransferTransaction(
//     '0', // destChainId
//     '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
//     [], // assetIds
//     ['50000000'], // amounts
//     {
//         format: 'submittable',
//         keepAlive: true
//     } // opts
//     );

//     console.log('submittable', submittable.direction);
//     const call = api.registry.createType('Extrinsic', submittable.tx.toHex());
//     console.log('call is', call.method.toString());
}

main();
