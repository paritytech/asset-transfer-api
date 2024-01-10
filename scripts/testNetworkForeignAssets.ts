// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import chalk from 'chalk';

import { KUSAMA_ASSET_HUB_WS_URL, ROCOCO_ALICE_WS_URL, ROCOCO_ASSET_HUB_WS_URL } from './consts';
import { awaitBlockProduction, awaitEpochChange, delay, logWithDate } from './util';

const fAssetSetMetadataCall = (assetHubApi: ApiPromise): `0x${string}` => {
	const rockmineMultilocatino = {
		parents: 1,
		interior: {
			X1: {
				parachain: 1836,
			},
		},
	};

	const setMetadataTx = assetHubApi.tx.foreignAssets.setMetadata(rockmineMultilocatino, 'Asset Hub Rococo Hop', 'Hop', 12);

	const hexCall = assetHubApi.registry
		.createType('Call', {
			callIndex: setMetadataTx.callIndex,
			args: setMetadataTx.args,
		})
		.toHex();

	return hexCall;
};

const fAssetCreateCall = (assetHubApi: ApiPromise): `0x${string}` => {
	const rockmineMultilocatino = {
		parents: 1,
		interior: {
			X1: {
				parachain: 3000,
			},
		},
	};

	const createTx = assetHubApi.tx.foreignAssets.create(
		rockmineMultilocatino,
		'5Eg2fnsjAAr8RGZfa8Sy5mYFPabA9ZLNGYECCKXPD6xnK6D2', // Sibling 1836 -> ParaId
		'100000000000',
	);

	const hexCall = assetHubApi.registry
		.createType('Call', {
			callIndex: createTx.callIndex,
			args: createTx.args,
		})
		.toHex();

	return hexCall;
};

const sudoCallWrapper = (rockmineApi: ApiPromise, call: `0x${string}`) => {
	// Double encode the call
	const xcmDoubleEncoded = rockmineApi.createType('XcmDoubleEncoded', {
		encoded: call,
	});

	const xcmOriginType = rockmineApi.createType('XcmOriginKind', 'Xcm');
	const xcmDestMultiLocation = {
		V3: {
			parents: 1,
			interior: {
				X1: {
					parachain: 1000,
				},
			},
		},
	};
	const xcmMessage = {
		V3: [
			{
				withdrawAsset: [
					{
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
				],
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
						refTime: 8000000000,
						proofSize: 65536,
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
	const xcmMsg = rockmineApi.tx.polkadotXcm.send(xcmDestMultiLocation, xcmMessage);
	const xcmCall = rockmineApi.createType('Call', {
		callIndex: xcmMsg.callIndex,
		args: xcmMsg.args,
	});

	return xcmCall;
};

const createForeignAssetViaSudo = (assetHubApi: ApiPromise, rockmineApi: ApiPromise) => {
	const foreignAssetCreateCall = fAssetCreateCall(assetHubApi);
	return sudoCallWrapper(rockmineApi, foreignAssetCreateCall);
};

const setMetadataForeignAssetViaSudo = (assetHubApi: ApiPromise, rockmineApi: ApiPromise) => {
	const setMetadataCall = fAssetSetMetadataCall(assetHubApi);
	return sudoCallWrapper(rockmineApi, setMetadataCall);
};

const openHrmpChannels = (api: ApiPromise, sender: number, receiver: number) => {
	return api.tx.hrmp.forceOpenHrmpChannel(sender, receiver, Number(8), Number(512));
};

const main = async () => {
	logWithDate(chalk.yellow('Initializing script to create foreignAssets on chain'));
	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	const alice = keyring.addFromUri('//Alice');
	const bob = keyring.addFromUri('//Bob');

	const kusamaAssetHubApi = await ApiPromise.create({
		provider: new WsProvider(KUSAMA_ASSET_HUB_WS_URL),
		noInitWarn: true,
	});

	await kusamaAssetHubApi.isReady;
	logWithDate(chalk.green('Created a connection to Kusama AssetHub'));

	const rockmineApi = await ApiPromise.create({
		provider: new WsProvider(ROCOCO_ASSET_HUB_WS_URL),
		noInitWarn: true,
	});

	await rockmineApi.isReady;
	logWithDate(chalk.green('Created a connection to Rococo Asset Hub'));

	const relayApi = await ApiPromise.create({
		provider: new WsProvider(ROCOCO_ALICE_WS_URL),
		noInitWarn: true,
	});

	await relayApi.isReady;

	logWithDate(chalk.green('Created a connection to Rococo'));

	logWithDate(chalk.blue('Opening HRMP Channels'));

	const hrmpChannelCalls = [];

	hrmpChannelCalls.push(openHrmpChannels(relayApi, Number(1000), Number(1836)));
	hrmpChannelCalls.push(openHrmpChannels(relayApi, Number(1836), Number(1000)));

	await relayApi.tx.sudo.sudo(relayApi.tx.utility.batchAll(hrmpChannelCalls)).signAndSend(alice);

	await awaitEpochChange(relayApi);
	logWithDate(chalk.magenta('HRMP channels open'));

	logWithDate(chalk.magenta('Sending funds to Rococo Asset Hub Sibling on Kusama AssetHub'));

	await kusamaAssetHubApi.tx.balances
		.transferKeepAlive('5Eg2fnsjAAr8RGZfa8Sy5mYFPabA9ZLNGYECCKXPD6xnK6D2', 10000000000000)
		.signAndSend(bob);

	const foreignAssetsCreateSudoXcmCall = createForeignAssetViaSudo(kusamaAssetHubApi, rockmineApi);

	logWithDate('Sending Sudo XCM message from relay chain to execute create foreign asset call on Kusama AssetHub');
	await rockmineApi.tx.sudo.sudo(foreignAssetsCreateSudoXcmCall).signAndSend(alice);

	await delay(24000);

	const foreignAssetsSetMetadataSudoXcmCall = setMetadataForeignAssetViaSudo(kusamaAssetHubApi, rockmineApi);

	logWithDate('Sending Sudo XCM message from relay chain to execute setMetadata call on Kusama AssetHub');
	await rockmineApi.tx.sudo.sudo(foreignAssetsSetMetadataSudoXcmCall).signAndSend(alice);

	await delay(24000);

	await kusamaAssetHubApi.disconnect().then(() => {
		logWithDate(chalk.blue('Polkadot-js successfully disconnected from asset-hub'));
	});

	await rockmineApi.disconnect().then(() => {
		logWithDate(chalk.blue('Polkadot-js successfully disconnected from Rococo Asset Hub'));
	});
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
awaitBlockProduction(ROCOCO_ASSET_HUB_WS_URL).then(async () => {
	await main()
		.catch(console.error)
		.finally(() => process.exit());
});
