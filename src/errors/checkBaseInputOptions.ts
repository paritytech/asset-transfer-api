import { Format, TransferArgsOpts } from '../types';
import { BaseError, BaseErrorsEnum } from './BaseError';

export const checkBaseInputOptions = (opts: TransferArgsOpts<Format>) => {
	const { paysWithFeeOrigin, format } = opts;

	if (paysWithFeeOrigin) {
		if (format === 'call' || format === 'submittable') {
			throw new BaseError(
				`PaysWithFeeOrigin is only compatible with the format type payload. Received: ${format}`,
				BaseErrorsEnum.InvalidInput
			);
		}
	}
};
