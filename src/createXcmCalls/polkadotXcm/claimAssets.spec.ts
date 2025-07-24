import { Registry } from '../../registry';
import { adjustedMockSystemApi } from '../../testHelpers/adjustedMockSystemApiV1004000';
import { adjustedMockSystemApiV1016000 } from '../../testHelpers/adjustedMockSystemApiV1016000';
import { claimAssets } from './claimAssets';

describe('claimAssets', () => {
	const specName = 'westmint';
	const registry = new Registry(specName, {});

	it('Should correctly construct an XCM V4 claimAssets call', async () => {
		const assetIds = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 4;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets({
			api: adjustedMockSystemApiV1016000,
			registry,
			specName,
			assetIds,
			amounts,
			beneficiaryAddress,
			xcmVersion,
			originChainId: '1000',
			isLiquidTokenTransfer: false,
		});

		expect(ext.toHex()).toEqual(
			'0xd8041f0c04040102043205011f0002093d000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
	it('Should correctly construct an XCM V3 claimAssets call', async () => {
		const assetIds = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 3;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets({
			api: adjustedMockSystemApiV1016000,
			registry,
			specName,
			assetIds,
			amounts,
			beneficiaryAddress,
			xcmVersion,
			originChainId: '1000',
			isLiquidTokenTransfer: false,
		});

		expect(ext.toHex()).toEqual(
			'0xdc041f0c0304000102043205011f0002093d000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
	it('Should correctly construct an XCM V2 claimAssets call', async () => {
		const assetIds = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 2;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const ext = await claimAssets({
			api: adjustedMockSystemApiV1016000,
			registry,
			specName,
			assetIds,
			amounts,
			beneficiaryAddress,
			xcmVersion,
			originChainId: '1000',
			isLiquidTokenTransfer: false,
		});

		expect(ext.toHex()).toEqual(
			'0xdc041f0c0104000102043205011f0002093d000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		);
	});
	it('Should correctly throw an error when the claimAssets call is not found in the runtime', async () => {
		const assetIds = [`{"parents":"1","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`];
		const amounts = ['1000000'];
		const xcmVersion = 4;
		const beneficiaryAddress = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		await expect(async () => {
			await claimAssets({
				api: adjustedMockSystemApi,
				registry,
				specName,
				assetIds,
				amounts,
				beneficiaryAddress,
				xcmVersion,
				originChainId: '1000',
				isLiquidTokenTransfer: false,
			});
		}).rejects.toThrow('Did not find claimAssets call from pallet polkadotXcm in the current runtime.');
	});
});
