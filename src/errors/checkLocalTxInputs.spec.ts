// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { checkLocalTxInput } from './checkLocalTxInputs';

describe('checkLocalTxInput', () => {
	const registry = new Registry('statemine', {});
	const specName = 'statemine';

	it('Should correctly return Balances with an empty assetIds', () => {
		const res = checkLocalTxInput([], ['10000'], specName, registry);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Balances with a native token', () => {
		const res = checkLocalTxInput(['KSM'], ['10000'], specName, registry);
		expect(res).toEqual('Balances');
	});
	it('Should correctly return Assets with a valid assetId', () => {
		const res = checkLocalTxInput(['1984'], ['10000'], specName, registry);
		expect(res).toEqual('Assets');
	});
	it('Should correctly throw an error for incorrect length on `assetIds`', () => {
		const err = () => checkLocalTxInput(['1', '2'], ['10000'], specName, registry);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error for incorrect length on `amounts`', () => {
		const err = () => checkLocalTxInput(['1'], ['10000', '20000'], specName, registry);
		expect(err).toThrowError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1'
		);
	});
	it('Should correctly throw an error with an incorrect assetId', () => {
		const err = () => checkLocalTxInput(['TST'], ['10000'], specName, registry);
		expect(err).toThrowError(
			'general index for assetId TST was not found'
		);
	});
	it("Should correctly throw an error when the assetId doesn't exist", () => {
		const err = () => checkLocalTxInput(['9876111'], ['10000'], specName, registry);
		expect(err).toThrowError(
			'The assetId 9876111 does not exist in the registry.'
		);
	});
});
