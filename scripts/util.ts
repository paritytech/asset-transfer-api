// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatDate } from '@polkadot/util';
import chalk from 'chalk';

/**
 * Set a delay (sleep)
 *
 * @param ms Milliseconds
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats a string to match the output of polkadot-js logging.
 *
 * @param log String to be logged
 * @param remove Remove lines before that were cleared by std
 */
export const logWithDate = (log: string, remove?: boolean) => {
	remove
		? console.log(`\r${formatDate(new Date())}          ${log}`)
		: console.log(`${formatDate(new Date())}          ${log}`);
};

/**
 * Will block the main script from running until there is blocks in Polkadot AssetHub being produced.
 */
export const awaitBlockProduction = async (wsUrl: string) => {
	logWithDate(chalk.yellow(`Initializing polkadot-js: Polling until ${wsUrl} is available`));
	const api = await ApiPromise.create({
		provider: new WsProvider(wsUrl),
		noInitWarn: true,
	});
	logWithDate(chalk.yellow('Polkadot-js is connected'));

	await api.isReady;

	let counter = 3;
	let blocksProducing = false;
	while (!blocksProducing) {
		const { number } = await api.rpc.chain.getHeader();

		if (number.toNumber() > 0) {
			blocksProducing = true;
		}
		await delay(1000);

		counter += 1;
		process.stdout.clearLine(0);
		process.stdout.write(`\rWaiting for Block production on Kusama AssetHub${'.'.repeat((counter % 3) + 1)}`);
	}

	process.stdout.clearLine(0);
	logWithDate(chalk.magenta('Blocks are producing'), true);
	await api.disconnect().then(() => {
		logWithDate(chalk.blue('Polkadot-js successfully disconnected'));
	});
};

export const awaitEpochChange = async (api: ApiPromise) => {
	const currentEpoch = await api.call.babeApi.currentEpoch();
	const currentEpochIndex = currentEpoch.epochIndex;
	let counter = 1;
	let changedEpoch = false;
	while (!changedEpoch) {
		const { epochIndex } = await api.call.babeApi.currentEpoch();

		if (epochIndex.toNumber() > currentEpochIndex.toNumber() + 1) {
			changedEpoch = true;
		}
		await delay(1000);

		counter += 1;
		process.stdout.clearLine(0);
		process.stdout.write(`\rWaiting for Epoch change${'.'.repeat((counter % 3) + 1)}`);
	}

	process.stdout.clearLine(0);
	logWithDate(chalk.magenta('Epoch changed'), true);
};
