// Copyright 2023 Parity Technologies (UK) Ltd.

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
	if (opts.paysWithFeeOrigin) {
		const { paysWithFeeOrigin } = disabledOpts;
		const chain = specName.toLowerCase();
		if (paysWithFeeOrigin.chains.includes(chain)) {
			paysWithFeeOrigin.error(`paysWithFeeOrigin`, chain);
		}

		if (paysWithFeeOrigin.chains.includes('*')) {
			paysWithFeeOrigin.error(`paysWithFeeOrigin`, `all chains`);
		}
	}
};
