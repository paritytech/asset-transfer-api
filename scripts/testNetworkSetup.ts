import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { DispatchError } from '@polkadot/types/interfaces';
import { formatDate } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import chalk from 'chalk';

/**
 * This script is intended to be run after zombienet is running.
 * It uses the hard coded values given in `zombienet.toml`.
 */

const WESTMINT_WS_URL = 'ws://127.0.0.1:9040';
const ROCOCO_ALICE_WS_URL = 'ws://127.0.0.1:9000';

/**
 * Set a delay (sleep)
 *
 * @param ms Milliseconds
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats a string to match the output of polkadot-js logging.
 *
 * @param log String to be logged
 * @param remove Remove lines before that were cleared by std
 */
const logWithDate = (log: string, remove?: boolean) => {
	remove
		? console.log(`\r${formatDate(new Date())}          ${log}`)
		: console.log(`${formatDate(new Date())}          ${log}`);
};

/**
 * Will block the main script from running until there is blocks in statemint being produced.
 */
const awaitBlockProduction = async () => {
	logWithDate(
		chalk.yellow(
			`Initializing polkadot-js: Polling until ${WESTMINT_WS_URL} is available`
		)
	);
	const parachainApi = await ApiPromise.create({
		provider: new WsProvider(WESTMINT_WS_URL),
		noInitWarn: true,
	});
	logWithDate(chalk.yellow('Polkadot-js is connected'));

	await parachainApi.isReady;

	let counter = 3;
	let blocksProducing = false;
	while (!blocksProducing) {
		const { number } = await parachainApi.rpc.chain.getHeader();

		if (number.toNumber() > 0) {
			blocksProducing = true;
		}
		await delay(1000);

		counter += 1;
		process.stdout.clearLine(0);
		process.stdout.write(
			`\rWaiting for Block production on westmint${'.'.repeat(
				(counter % 3) + 1
			)}`
		);
	}

	process.stdout.clearLine(0);
	logWithDate(chalk.magenta('Blocks are producing'), true);
	await parachainApi.disconnect().then(() => {
		logWithDate(chalk.blue('Polkadot-js successfully disconnected'));
	});
};

const main = async () => {
	logWithDate(chalk.yellow('Initializing script to run transaction on chain'));
	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	const alice = keyring.addFromUri('//Alice');

	const assetInfo = {
		assetId: 1,
		assetName: 'Test',
		assetSymbol: 'TST',
		assetDecimals: 10,
	};

	const parachainApi = await ApiPromise.create({
		provider: new WsProvider(WESTMINT_WS_URL),
		noInitWarn: true,
	});

	await parachainApi.isReady;
	logWithDate(chalk.green('Created a connection to Westmint'));

	const rococoApi = await ApiPromise.create({
		provider: new WsProvider(ROCOCO_ALICE_WS_URL),
		noInitWarn: true,
	});

	await rococoApi.isReady;
	logWithDate(chalk.green('Created a connection to Rococo'));

	/**
	 * Create this call via the parachain api, since this is the chain in which it will be called.
	 */
	const forceCreate = parachainApi.tx.assets.forceCreate(
		assetInfo.assetId,
		alice.address,
		true,
		1000
	);
	const forceCreateCall = parachainApi.createType('Call', {
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
		V1: {
			parents: 0,
			interior: {
				X1: {
					parachain: 100,
				},
			},
		},
	};
	const xcmMessage = {
		V2: [
			{
				transact: {
					originType: xcmOriginType,
					requireWeightAtMost: 1000000000,
					call: xcmDoubleEncoded,
				},
			},
		],
	};
	const multiLocation = rococoApi.createType(
		'XcmVersionedMultiLocation',
		xcmDest
	);
	const xcmVersionedMsg = rococoApi.createType('XcmVersionedXcm', xcmMessage);
	const xcmMsg = rococoApi.tx.xcmPallet.send(multiLocation, xcmVersionedMsg);
	const xcmCall = rococoApi.createType('Call', {
		callIndex: xcmMsg.callIndex,
		args: xcmMsg.args,
	});

	logWithDate(
		'Sending Sudo XCM message from relay chain to execute forceCreate call on westmint'
	);
	await rococoApi.tx.sudo.sudo(xcmCall).signAndSend(alice);

	/**
	 * Make sure we allow the asset enough time to be created before we mint.
	 * This is because parachain block production by default can be expected to be 12 seconds.
	 */
	await delay(24000);

	/**
	 * Mint the asset after its forceCreated by Alice.
	 */
	const { nonce } = await parachainApi.query.system.account(alice.address);
	const txs = [
		parachainApi.tx.assets.setMetadata(
			assetInfo.assetId,
			assetInfo.assetName,
			assetInfo.assetSymbol,
			assetInfo.assetDecimals
		),
		parachainApi.tx.assets.mint(
			assetInfo.assetId,
			alice.address,
			1000 * 120000000
		),
	];
	const batch = parachainApi.tx.utility.batchAll(txs);

	logWithDate('Sending batch call in order to mint a test asset on westmint');
	await batch.signAndSend(alice, { nonce }, ({ status, events }) => {
		if (status.isInBlock || status.isFinalized) {
			events
				// find/filter for failed events
				.filter(({ event }) =>
					parachainApi.events.system.ExtrinsicFailed.is(event)
				)
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
							const decoded = parachainApi.registry.findMetaError(
								(error as DispatchError).asModule
							);
							const { docs, method, section } = decoded;

							console.log(`${section}.${method}: ${docs.join(' ')}`);
						} else {
							// Other, CannotLookup, BadOrigin, no extra info
							console.log(error.toString());
						}
					}
				);
		}
	});
	logWithDate(chalk.yellow('Script finished. Exiting'));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
awaitBlockProduction().then(async () => {
	await main()
		.catch(console.error)
		.finally(() => process.exit());
});
