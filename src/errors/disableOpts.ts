// Copyright 2023 Parity Technologies (UK) Ltd.

import type { MappedOpts } from '../config/disabledOpts';
import { disabledOpts } from '../config/disabledOpts';
import type { Format, TransferArgsOpts } from '../types';

/**
 * This checks specific options to ensure they are disabled when met in certain conditions.
 *
 * @param opts Options for `createTransferTransaction`
 * @param specName SpecName of the current chain
 */
export const disableOpts = <T extends Format>(
	opts: TransferArgsOpts<T>,
	specName: string
) => {
	const optKeys = Object.keys(opts) as MappedOpts[];
	const chain = specName.toLowerCase();

	for (const key of optKeys) {
		const disabledKeyInfo = disabledOpts[key];
		if (opts[key] && disabledKeyInfo.disabled) {
			if (disabledKeyInfo.chains.includes('*')) {
				disabledKeyInfo.error(key, `all chains`);
			}
			if (disabledKeyInfo.chains.includes(chain)) {
				disabledKeyInfo.error(key, chain);
			}
		}
	}
};
