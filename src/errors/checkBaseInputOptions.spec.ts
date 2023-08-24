import type { Format, TransferArgsOpts } from '../types';
import { checkBaseInputOptions } from './checkBaseInputOptions';

describe('checkBaseInputOptions', () => {
	it('Should error when a call is used with `PaysWithFeeOrigin`', () => {
		const opts = {
			format: 'call',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts);

		expect(err).toThrow(
			'PaysWithFeeOrigin is only compatible with the format type payload. Received: call'
		);
	});
});
