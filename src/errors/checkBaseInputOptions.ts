import type { Format, TransferArgsOpts } from '../types.js';
import { validateAddress } from '../validate/index.js';
import { BaseError, BaseErrorsEnum } from './BaseError.js';
import { disableOpts } from './disableOpts.js';

/**
 * Ensure that options that require certain inputs are validated.
 *
 * @param opts
 */
export const checkBaseInputOptions = (opts: TransferArgsOpts<Format>, specName: string) => {
	const { paysWithFeeOrigin, format, sendersAddr } = opts;

	disableOpts(opts, specName);

	if (paysWithFeeOrigin) {
		if (format === 'call' || format === 'submittable') {
			throw new BaseError(
				`PaysWithFeeOrigin is only compatible with the format type payload. Received: ${format}`,
				BaseErrorsEnum.InvalidInput,
			);
		}
	}

	if (format === 'payload' && !sendersAddr) {
		throw new BaseError(
			`The 'sendersAddr' option must be present when constructing a 'payload' format.`,
			BaseErrorsEnum.InvalidInput,
		);
	}

	if (sendersAddr) {
		const [bool, errMsg] = validateAddress(sendersAddr);

		if (!bool) {
			throw new BaseError(`The inputted sendersAddr is not valid. ${errMsg as string}`, BaseErrorsEnum.InvalidInput);
		}
	}
};
