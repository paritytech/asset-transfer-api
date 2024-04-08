// Copyright 2024 Parity Technologies (UK) Ltd.

import { adjustedMockSystemApiV1009000 } from '../../testHelpers/adjustedMockSystemApiV1009000';
import { claimAssets } from './claimAssets';

describe('claimAssets', () => {
	it('Should correctly construct an XCM V4 claimAssets call', async () => {
		const assets = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 4;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets(adjustedMockSystemApiV1009000, assets, amounts, xcmVersion, beneficiaryAddress);

		expect(ext.toHex()).toEqual(
			'0xd8041f0c04040102043205011f0002093d000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
	it('Should correctly construct an XCM V3 claimAssets call', async () => {
		const assets = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 3;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets(adjustedMockSystemApiV1009000, assets, amounts, xcmVersion, beneficiaryAddress);

		expect(ext.toHex()).toEqual(
			'0xdc041f0c0304000102043205011f0002093d000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
	it('Should correctly construct an XCM V2 claimAssets call', async () => {
		const assets = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 2;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets(adjustedMockSystemApiV1009000, assets, amounts, xcmVersion, beneficiaryAddress);

		expect(ext.toHex()).toEqual(
			'0xdc041f0c0104000102043205011f0002093d000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
});
