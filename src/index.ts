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
		// `wss://westend-rpc.polkadot.io`,
        // `wss://westend-asset-hub-rpc.polkadot.io`
		`wss://moonriver.api.onfinality.io/public-ws`
		// `wss://bifrost-rpc.liebi.com/ws`
		// `wss://rpc.shiden.astar.network`
	);

	const api = await ApiPromise.create({ provider });

	await api.isReady;

	const assetTransferApi = new AssetTransferApi(api, 'moonriver', 3);

	const payload = await assetTransferApi.createTransferTransaction(
		'1000',
		'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		['xcusdt'],
		['1000000000000000000'],
		{
			format: 'payload',
			xcmVersion: 3,
			isLimited: false,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
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
};

main();
