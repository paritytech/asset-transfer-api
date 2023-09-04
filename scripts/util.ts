// Copyright 2023 Parity Technologies (UK) Ltd.

import { formatDate } from '@polkadot/util';

/**
 * Set a delay (sleep)
 *
 * @param ms Milliseconds
 */
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

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
