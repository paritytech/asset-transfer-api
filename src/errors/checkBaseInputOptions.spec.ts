// Copyright 2023 Parity Technologies (UK) Ltd.

import type { Format, TransferArgsOpts } from '../types.js';
import { checkBaseInputOptions } from './checkBaseInputOptions.js';

describe('checkBaseInputOptions', () => {
	it('Should error when a call is used with `PaysWithFeeOrigin`', () => {
		const opts = {
			format: 'call',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts, 'statemine');

		expect(err).toThrow('PaysWithFeeOrigin is only compatible with the format type payload. Received: call');
	});
	it('Should error when a submittable is used with `PaysWithFeeOrigin`', () => {
		const opts = {
			format: 'submittable',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts, 'statemine');

		expect(err).toThrow('PaysWithFeeOrigin is only compatible with the format type payload. Received: submittable');
	});
	it('Should error when a payload format is inputted but there is no sendersAddr', () => {
		const opts = {
			format: 'payload',
			paysWithFeeOrigin: '1984',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts, 'statemine');

		expect(err).toThrow("The 'sendersAddr' option must be present when constructing a 'payload' format.");
	});
	it('Should error when a sendersAddr is an incorrect format', () => {
		const opts = {
			format: 'payload',
			paysWithFeeOrigin: '1984',
			sendersAddr: '0x000',
		} as TransferArgsOpts<Format>;
		const err = () => checkBaseInputOptions(opts, 'statemine');

		expect(err).toThrow('The inputted sendersAddr is not valid. Invalid base58 character "0" (0x30) at index 0');
	});
	it('Should not error when a sendersAddr is a correct format', () => {
		const opts = {
			format: 'payload',
			paysWithFeeOrigin: '1984',
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		} as TransferArgsOpts<Format>;
		const res = () => checkBaseInputOptions(opts, 'statemine');

		expect(res).not.toThrow();
	});
});
