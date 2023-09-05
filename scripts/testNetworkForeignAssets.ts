// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import chalk from 'chalk';

import { KUSAMA_ASSET_HUB_WS_URL, TRAPPIST_WS_URL } from './consts';
import { logWithDate } from './util';

const createForeignAssetCall = (
	assetHubApi: ApiPromise,
	trappistApi: ApiPromise
) => {
	const trappistMultiLocation = assetHubApi.registry.createType(
		'MultiLocation',
		{
			parents: 1,
			interior: {
				X1: {
					parachain: 1836,
				},
			},
		}
	);

	const foreignAssetCreateTx = assetHubApi.tx.foreignAssets.create(
		trappistMultiLocation,
		'FBeL7DbnXs4AvP7LqG1yiuFYAsPxE9Yiv4wayoLguBH46Bp', // Sibling 1836 -> ParaId
		'33333333'
	);

	const foreignAssetCreateCallHex = assetHubApi.registry
		.createType('Call', {
			callIndex: foreignAssetCreateTx.callIndex,
			args: foreignAssetCreateTx.args,
		})
		.toHex();

	// Double encode the call
	const xcmDoubleEncoded = trappistApi.createType('XcmDoubleEncoded', {
		encoded: foreignAssetCreateCallHex,
	});

	const xcmOriginType = trappistApi.createType('XcmOriginKind', 'Xcm');
	const xcmDestMultiLocation = trappistApi.createType(
		'XcmVersionedMultiLocation',
		{
			V3: {
				parents: 0,
				interior: {
					X1: {
						parachain: 1000,
					},
				},
			},
		}
	);
	const xcmMessage = {
		V3: [
			{
				withdrawAsset: {
					id: {
						concrete: {
							parents: 1,
							interior: { Here: '' },
						},
					},
					fun: {
						fungible: 100000000000,
					},
				},
			},
			{
				buyExecution: {
					fees: {
						id: {
							concrete: {
								parents: 1,
								interior: { Here: '' },
							},
						},
						fun: {
							fungible: 100000000000,
						},
					},
					weightLimit: { Unlimited: '' },
				},
			},
			{
				transact: {
					originKind: xcmOriginType,
					requireWeightAtMost: {
						refTime: 1000000000,
						proofSize: 900000,
					},
					call: xcmDoubleEncoded,
				},
			},
			{
				refundSurplus: true,
			},
			{
				depositAsset: {
					assets: {
						wild: {
							All: '',
						},
					},
					beneficiary: {
						parents: 0,
						interior: {
							x1: {
								AccountId32: {
									id: '0x7369626c2c070000000000000000000000000000000000000000000000000000',
								},
							},
						},
					},
				},
			},
		],
	};
	const xcmVersionedMsg = trappistApi.createType('XcmVersionedXcm', xcmMessage);
	const xcmMsg = trappistApi.tx.xcmPallet.send(
		xcmDestMultiLocation,
		xcmVersionedMsg
	);
	const xcmCall = trappistApi.createType('Call', {
		callIndex: xcmMsg.callIndex,
		args: xcmMsg.args,
	});

	return xcmCall;
};

const main = async () => {
	logWithDate(
		chalk.yellow('Initializing script to create foreignAssets on chain')
	);
	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	const alice = keyring.addFromUri('//Alice');
	console.log(alice);

	const kusamaAssetHubApi = await ApiPromise.create({
		provider: new WsProvider(KUSAMA_ASSET_HUB_WS_URL),
		noInitWarn: true,
	});

	await kusamaAssetHubApi.isReady;
	logWithDate(chalk.green('Created a connection to Kusama AssetHub'));

	const trappistApi = await ApiPromise.create({
		provider: new WsProvider(TRAPPIST_WS_URL),
		noInitWarn: true,
	});

	await trappistApi.isReady;
	logWithDate(chalk.green('Created a connection to Trappist'));

	const createForeignAssetsXcmCall = createForeignAssetCall(
		kusamaAssetHubApi,
		trappistApi
	);

	logWithDate(
		'Sending Sudo XCM message from relay chain to execute forceCreate call on Kusama AssetHub'
	);
	await trappistApi.tx.sudo.sudo(createForeignAssetsXcmCall).signAndSend(alice);

	await kusamaAssetHubApi.disconnect().then(() => {
		logWithDate(
			chalk.blue('Polkadot-js successfully disconnected from asset-hub')
		);
	});

	await trappistApi.disconnect().then(() => {
		logWithDate(
			chalk.blue('Polkadot-js successfully disconnected from trappist')
		);
	});
};

main()
	.catch(console.error)
	.finally(() => process.exit());
