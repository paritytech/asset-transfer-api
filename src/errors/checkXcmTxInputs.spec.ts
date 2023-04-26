import { IDirection } from '../types';
import { checkXcmTxInputs } from './checkXcmTxInputs';

describe('checkXcmTxinputs', () => {
	it("Should error when inputted assetId's dont match amounts length", () => {
		const err = () =>
			checkXcmTxInputs(['1000'], ['10', '10'], IDirection.SystemToPara);

		expect(err).toThrow(
			'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
		);
	});
});
