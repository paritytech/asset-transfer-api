// Copyright 2023 Parity Technologies (UK) Ltd.

import { disableOpts } from './disableOpts';

describe('disableOpts', () => {
	it('Should error for paysWithFeeOrigin', () => {
		const err = () => disableOpts({ paysWithFeeOrigin: 'DOT' }, 'westmint');
		expect(err).toThrow('paysWithFeeOrigin is disbaled for westmint.');
	});
});
