import { getXcmCreator } from '../xcm';
import { resolveAssetTransferType } from './resolveAssetTransferType';

describe('resolveAssetTransferType', () => {
	describe('RemoteReserve', () => {
		it('Should correctly resolve the asset transfer RemoteReserve type for XCM V3', () => {
			const assetTransferType = 'RemoteReserve';
			const xcmVersion = 3;
			const xcmCreator = getXcmCreator(xcmVersion);
			const remoteTransferLocationStr = '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}';

			const expected = {
				RemoteReserve: {
					V3: {
						parents: '1',
						interior: {
							X1: {
								Parachain: '1000',
							},
						},
					},
				},
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator, remoteTransferLocationStr)).toEqual(expected);
		});
		it('Should correctly resolve the asset transfer RemoteReserve type for XCM V4', () => {
			const assetTransferType = 'RemoteReserve';
			const xcmVersion = 4;
			const xcmCreator = getXcmCreator(xcmVersion);
			const remoteTransferLocationStr = '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}';

			const expected = {
				RemoteReserve: {
					V4: {
						parents: '1',
						interior: {
							X1: [{ Parachain: '1000' }],
						},
					},
				},
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator, remoteTransferLocationStr)).toEqual(expected);
		});
		it('Should correctly resolve the asset transfer RemoteReserve type for XCM V5', () => {
			const assetTransferType = 'RemoteReserve';
			const xcmVersion = 5;
			const xcmCreator = getXcmCreator(xcmVersion);
			const remoteTransferLocationStr = '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}';

			const expected = {
				RemoteReserve: {
					V5: {
						parents: '1',
						interior: {
							X1: [{ Parachain: '1000' }],
						},
					},
				},
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator, remoteTransferLocationStr)).toEqual(expected);
		});
	});
	describe('LocalReserve', () => {
		it('Should correctly resolve the asset transfer LocalReserve type', () => {
			const assetTransferType = 'LocalReserve';
			const xcmVersion = 4;
			const xcmCreator = getXcmCreator(xcmVersion);

			const expected = {
				LocalReserve: 'null',
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator)).toEqual(expected);
		});
	});
	describe('DestinationReserve', () => {
		it('Should correctly resolve the asset transfer DestinationReserve type', () => {
			const assetTransferType = 'DestinationReserve';
			const xcmVersion = 4;
			const xcmCreator = getXcmCreator(xcmVersion);

			const expected = {
				DestinationReserve: 'null',
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator)).toEqual(expected);
		});
	});
	describe('Teleport', () => {
		it('Should correctly resolve the asset transfer Teleport type', () => {
			const assetTransferType = 'Teleport';
			const xcmVersion = 4;
			const xcmCreator = getXcmCreator(xcmVersion);

			const expected = {
				Teleport: 'null',
			};

			expect(resolveAssetTransferType(assetTransferType, xcmCreator)).toEqual(expected);
		});
	});
});
