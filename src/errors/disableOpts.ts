// Copyright 2023 Parity Technologies (UK) Ltd.

import { disabledOpts } from '../config/disabledOpts';
import type { Format, TransferArgsOpts } from '../types';
import { BaseError, BaseErrorsEnum } from './BaseError';

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
		if (paysWithFeeOrigin.chains.includes(specName.toLowerCase())) {
			throw new BaseError(
				`paysWithFeeOrigin is disbaled for ${specName.toLowerCase()}.`,
				BaseErrorsEnum.DisabledOption
			);
		}
	}
};
