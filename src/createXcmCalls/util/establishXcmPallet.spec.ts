// Copyright 2023 Parity Technologies (UK) Ltd.

import { mockRelayApi } from '../../testHelpers/mockRelayApi';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { establishXcmPallet } from './establishXcmPallet';

describe('establishXcmPallet', () => {
	it('Should detect xcmPallet pallet correctly', () => {
		const res = establishXcmPallet(mockRelayApi);
		expect(res).toEqual('xcmPallet');
	});
	it('Should detect polkadotXcm pallet correctly', () => {
		const res = establishXcmPallet(mockSystemApi);
		expect(res).toEqual('polkadotXcm');
	});
});
