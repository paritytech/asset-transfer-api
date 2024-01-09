// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { DispatchError } from '@polkadot/types/interfaces';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import chalk from 'chalk';

import { KUSAMA_ASSET_HUB_WS_URL, ROCOCO_ALICE_WS_URL } from './consts';
import { awaitBlockProduction, delay, logWithDate } from './util';

/**
 * This script is intended to be run after zombienet is running.
 * It uses the hard coded values given in `zombienet.toml`.
 */

const main = async () => {
	logWithDate(chalk.yellow('Initializing script to run transaction on chain'));
	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	const alice = keyring.addFromUri('//Alice');

	const assetInfo = {
		assetId: 1,
		assetName: 'xUSD',
		assetSymbol: 'XUSD',
		assetDecimals: 12,
	};

	const kusamaAssetHubApi = await ApiPromise.create({
		provider: new WsProvider(KUSAMA_ASSET_HUB_WS_URL),
		noInitWarn: true,
	});

	await kusamaAssetHubApi.isReady;
	logWithDate(chalk.green('Created a connection to Kusama AssetHub'));

	const rococoApi = await ApiPromise.create({
		provider: new WsProvider(ROCOCO_ALICE_WS_URL),
		noInitWarn: true,
	});

	await rococoApi.isReady;
	logWithDate(chalk.green('Created a connection to Rococo'));

	/**
	 * Create this call via the parachain api, since this is the chain in which it will be called.
	 */
	const forceCreate = kusamaAssetHubApi.tx.assets.forceCreate(assetInfo.assetId, alice.address, true, 1000);
	const forceCreateCall = kusamaAssetHubApi.createType('Call', {
		callIndex: forceCreate.callIndex,
		args: forceCreate.args,
	});
	/**
	 * Create an xcm call via the relay chain because this is the chain in which it will be called.
	 * NOTE: The relay chain will have sudo powers.
	 */
	const xcmDoubleEncoded = rococoApi.createType('XcmDoubleEncoded', {
		encoded: forceCreateCall.toHex(),
	});
	const xcmOriginType = rococoApi.createType('XcmOriginKind', 'Superuser');
	const xcmDest = {
		V3: {
			parents: 0,
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
				unpaidExecution: {
					weightLimit: { Unlimited: '' },
					checkOrigin: {
						parents: 1,
						interior: { Here: '' },
					},
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
		],
	};
	const multiLocation = rococoApi.createType('XcmVersionedMultiLocation', xcmDest);
	const xcmVersionedMsg = rococoApi.createType('XcmVersionedXcm', xcmMessage);
	const xcmMsg = rococoApi.tx.xcmPallet.send(multiLocation, xcmVersionedMsg);
	const xcmCall = rococoApi.createType('Call', {
		callIndex: xcmMsg.callIndex,
		args: xcmMsg.args,
	});

	logWithDate('Sending Sudo XCM message from relay chain to execute forceCreate call on Kusama AssetHub');
	await rococoApi.tx.sudo.sudo(xcmCall).signAndSend(alice);

	/**
	 * Make sure we allow the asset enough time to be created before we mint.
	 * This is because parachain block production by default can be expected to be 12 seconds.
	 */
	await delay(24000);

	/**
	 * Mint the asset after its forceCreated by Alice.
	 */
	const { nonce } = await kusamaAssetHubApi.query.system.account(alice.address);
	const txs = [
		kusamaAssetHubApi.tx.assets.setMetadata(
			assetInfo.assetId,
			assetInfo.assetName,
			assetInfo.assetSymbol,
			assetInfo.assetDecimals,
		),
		kusamaAssetHubApi.tx.assets.mint(assetInfo.assetId, alice.address, 100000 * 120000000),
	];
	const batch = kusamaAssetHubApi.tx.utility.batchAll(txs);

	logWithDate('Sending batch call in order to mint a test asset on Kusama AssetHub');
	await batch.signAndSend(alice, { nonce }, ({ status, events }) => {
		if (status.isInBlock || status.isFinalized) {
			events
				// find/filter for failed events
				.filter(({ event }) => kusamaAssetHubApi.events.system.ExtrinsicFailed.is(event))
				// we know that data for system.ExtrinsicFailed is
				// (DispatchError, DispatchInfo)
				.forEach(
					({
						event: {
							data: [error],
						},
					}) => {
						if ((error as DispatchError).isModule) {
							// for module errors, we have the section indexed, lookup
							const decoded = kusamaAssetHubApi.registry.findMetaError((error as DispatchError).asModule);
							const { docs, method, section } = decoded;

							console.log(`${section}.${method}: ${docs.join(' ')}`);
						} else {
							// Other, CannotLookup, BadOrigin, no extra info
							console.log(error.toString());
						}
					},
				);
		}
	});
	logWithDate(chalk.yellow('Script finished. Exiting'));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
awaitBlockProduction(KUSAMA_ASSET_HUB_WS_URL).then(async () => {
	await main()
		.catch(console.error)
		.finally(() => process.exit());
});
