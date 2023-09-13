import { Format, TransferArgsOpts } from '../types';
import { validateAddress } from '../validate';
import { BaseError, BaseErrorsEnum } from './BaseError';

/**
 * Ensure that options that require certain inputs are validated.
 *
 * @param opts
 */
export const checkBaseInputOptions = (opts: TransferArgsOpts<Format>) => {
	const { paysWithFeeOrigin, format, sendersAddr } = opts;

	if (paysWithFeeOrigin) {
		if (format === 'call' || format === 'submittable') {
			throw new BaseError(
				`PaysWithFeeOrigin is only compatible with the format type payload. Received: ${format}`,
				BaseErrorsEnum.InvalidInput
			);
		}
	}

	if (format === 'payload' && !sendersAddr) {
		throw new BaseError(
			"The 'sendersAddr' option must be present when constructing a 'payload' format.",
			BaseErrorsEnum.InvalidInput
		);
	}

	if (sendersAddr) {
		const [bool, errMsg] = validateAddress(sendersAddr);

		if (!bool) {
			throw new BaseError(
				`The inputted sendersAddr is not valid. ${errMsg as string}`,
				BaseErrorsEnum.InvalidInput
			);
		}
	}
};
