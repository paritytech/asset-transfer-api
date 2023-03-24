// Copyright 2023 Parity Technologies (UK) Ltd.

import { checkLocalTxInput } from './checkLocalTxInputs';

describe('checkLocalTxInput', () => {
	it('Should correctly throw an error for incorrect length on `assetIds`', () => {
		const err = () => checkLocalTxInput(['1', '2'], ['10000']);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error for incorrect length on `amounts`', () => {
		const err = () => checkLocalTxInput(['1'], ['10000', '20000']);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
		);
	});
});
