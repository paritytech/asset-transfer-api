import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { transferKeepAlive } from './transferKeepAlive';

describe('assets::transfer', () => {
	it('Should construct a valid transfer extrinsic', () => {
		const res = transferKeepAlive(
			mockSystemApi,
			'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			'1',
			'10000',
		);
		expect(res.toHex()).toEqual('0x9c0432090400f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b419c');
	});
});
