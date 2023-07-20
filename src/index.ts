// Copyright 2023 Parity Technologies (UK) Ltd.

export * from './AssetsTransferApi';
export * from './constructApiPromise';
export * from './types';

// import { VersionedMultiLocation } from '@capi/polkadot/types/xcm/mod';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { AssetsTransferApi } from './AssetsTransferApi';

// type DecodedExtrinsic = {
//  callIndex: string;
//  args: XCMInfo;
// };

// type XCMInfo = {
//  dest: VersionedMultiLocation;
//  benificiary: VersionedMultiLocation;
//  assets: VersionedMultiLocation;
//  fee_asset_item: string;
// };

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
    const provider = new WsProvider(`wss://moonriver.api.onfinality.io/public-ws`);


	const api = await ApiPromise.create({ provider });

	await api.isReady;

	const assetTransferApi = new AssetsTransferApi(api, 'moonriver', 2);
	// const assetTransferApi = new AssetsTransferApi(api, 'collectives', 2);

	// call
	// const call = await assetTransferApi.createTransferTransaction(
	//  '2000', // destChainId
	//  '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
	//  ['ksm', '10', '34', '36', '11', '12'], // assetIds
	//  ['100', '2000', '300', '400', '500', '700'], // amounts
	//  {
	//      paysWithFeeDest: '10',
	//      xcmVersion: 3,
	//      format: 'call',
	//      keepAlive: true,
	//  } // opts
	// );
	// console.log('call is', call);
	// const callExtrinsic = api.registry.createType('Call', call.tx);
	// console.log('call to human', callExtrinsic.toString());
	// const decoded1: DecodedExtrinsic = JSON.parse(callExtrinsic.toString());
	// console.log('decoded1', decoded1);

	//   // payload
	// const decoded = assetTransferApi.decodeExtrinsic(`0x95067b2263616c6c496e646578223a22307836333039222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b2270617261636861696e223a313030307d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307863323234616164396336663362626437383431323065396663656565356266643232613632633639313434656536373366373664366133346432383064653136227d7d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a353030303030307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
	// `, 'payload');
	// console.log('WHAT IS DECODED', decoded);
	// const payload = await assetTransferApi.createTransferTransaction(
	//  '1000', // destChainId
	//  '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
	//  [], // assetIds
	//  ['100'], // amounts
	//  {
	//      format: 'payload',
	//      keepAlive: true,
	//      // paysWithFeeOrigin: '1984',
	//  } // opts
	// );
	// console.log('payload is', payload);

	const payload = await assetTransferApi.createTransferTransaction(
		'1000',
		'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
		[
			'11',
		],
        // [
        //     '1984',
        //     '1984'
        // ],
		['2000000000'],
		{
			format: 'submittable',
			isLimited: false,
			xcmVersion: 3,
			// paysWithFeeOrigin: '1984',
			// paysWithFeeDest: 'USDC'
		}
	);

    // console.log('tx args', payload.tx.args[1].toHex());
	console.log('payload', JSON.stringify(payload));

	const decodedPayload = assetTransferApi.decodeExtrinsic(
		payload.tx.toHex(),
		'submittable'
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
	// const decoded2: DecodedExtrinsic = JSON.parse(payloadJSON);
	// console.log('decoded2', JSON.stringify(decoded2));

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
};

main();
