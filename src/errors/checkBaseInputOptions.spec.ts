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
	it('Should error when a submittable is used with `PaysWithFeeOrigin`', () => {
		const opts = {
			format: 'submittable',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts);

		expect(err).toThrow(
			'PaysWithFeeOrigin is only compatible with the format type payload. Received: submittable'
		);
	});
	it('Should error when a payload format is inputted but there is no sendersAddr', () => {
		const opts = {
			format: 'payload',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts);

		expect(err).toThrow(
			"The 'sendersAddr' option must be present when constructing a 'payload' format."
		);
	});
});
