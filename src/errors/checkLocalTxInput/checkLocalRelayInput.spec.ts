import { Registry } from '../../registry';
import { checkLocalRelayInput } from './checkLocalRelayInput';
import { LocalTxType } from './types';

describe('checkLocalRelayInput', () => {
	const registry = new Registry('asset-hub-paseo', { chainName: 'paseo' });

	it('Should return LocalTxType.Balances', () => {
		const res = checkLocalRelayInput([], ['10000'], registry);
		expect(res).toEqual(LocalTxType.Balances);
	});
	it('Should error with an invalid input', () => {
		expect(() => checkLocalRelayInput(['pas', 'ksm'], ['100000'], registry)).toThrow(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
		);
	});
	it('Should correctly error when a non native asset is passed in', () => {
		expect(() =>
			checkLocalRelayInput(['{"parents":"3","interior":{"X1":{"GlobalConsensus":"Westend"}}}'], ['100000'], registry),
		).toThrow(
			'AssetId {"parents":"3","interior":{"X1":{"GlobalConsensus":"Westend"}}} is not the native asset of paseo relay chain. Expected an assetId of PAS or asset location {"parents":"0","interior":{"Here":""}}',
		);
	});
});
