// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetsTransferApi } from '../AssetsTransferApi';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApi';
import type { Format, TxResult } from '../types';

const baseRelayCreateTx = async <T extends Format>(
	format: T,
	isLimited: boolean,
	xcmVersion: number
): Promise<TxResult<T>> => {
	return await relayAssetsApi.createTransferTransaction(
		'2000', // Since this is not `0` we know this is to a parachain
		'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		[],
		['100', '100'],
		{
			format,
			isLimited,
			xcmVersion,
		}
	);
};

const relayAssetsApi = new AssetsTransferApi(adjustedMockRelayApi);
const systemAssetsApi = new AssetsTransferApi(adjustedMockSystemApi);

describe('AssetTransferApi Integration Tests', () => {
	describe('createTransferTransaction', () => {
		describe('Local Asset Transfer', () => {
			it('Should construct a `transfer` call', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['1'],
					['100'],
					{
						format: 'call',
					}
				);
				expect(res).toEqual({
					direction: 'local',
					format: 'call',
					method: 'transfer',
					tx: '0x3208040078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `transferKeepAlive` call', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['1'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
					}
				);
				expect(res).toEqual({
					direction: 'local',
					format: 'call',
					method: 'transferKeepAlive',
					tx: '0x3209040078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
		});
		describe('SystemToPara', () => {
			const foreignBaseSystemCreateTx = async <T extends Format>(
				format: T,
				isLimited: boolean,
				xcmVersion: number
			): Promise<TxResult<T>> => {
				return await systemAssetsApi.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1', '2'],
					['100', '100'],
					{
						format,
						isLimited,
						xcmVersion,
					}
				);
			};
			const nativeBaseSystemCreateTx = async <T extends Format>(
				format: T,
				isLimited: boolean,
				xcmVersion: number
			): Promise<TxResult<T>> => {
				return await systemAssetsApi.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['DOT'],
					['100'],
					{
						format,
						isLimited,
						xcmVersion,
					}
				);
			};
			describe('V2', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('call', true, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100411f010800000204320504009101000002043205080091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('payload', true, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xed087b2263616c6c496e646578223a22307831663038222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a317d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a327d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('submittable', true, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('call', false, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f020100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100411f0108000002043205040091010000020432050800910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('payload', false, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0x65087b2263616c6c496e646578223a22307831663032222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a317d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a327d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a307d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx('submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a teleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', false, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100411f010400010000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a teleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('payload', false, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xfd057b2263616c6c496e646578223a22307831663031222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a312c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a307d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportsAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', true, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100411f01040001000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('payload', true, 2);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0x85067b2263616c6c496e646578223a22307831663039222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a312c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportsAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx('submittable', true, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('call', true, 3);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f080300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03010100411f030800000204320504009101000002043205080091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('payload', true, 3);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xcd087b2263616c6c496e646578223a22307831663038222c2261726773223a7b2264657374223a7b227633223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a6e756c6c2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227633223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227633223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a317d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a327d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('submittable', true, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
                it('Should correctly build a call for a reserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('call', false, 3);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f020300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03010100411f0308000002043205040091010000020432050800910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('payload', false, 3);
					expect(res).toEqual({
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0x45087b2263616c6c496e646578223a22307831663032222c2261726773223a7b2264657374223a7b227633223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a6e756c6c2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227633223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227633223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a317d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a327d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a307d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx('submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('RelayToPara', () => {
			describe('V2', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('call', true, 2);
					expect(res).toEqual({
						direction: 'RelayToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x63080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01000100411f01080000000091010000000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('payload', true, 2);
					expect(res).toEqual({
						direction: 'RelayToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xcd077b2263616c6c496e646578223a22307836333038222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('submittable', true, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('call', false, 2);
					expect(res).toEqual({
						direction: 'RelayToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x63020100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01000100411f010800000000910100000000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('payload', false, 2);
					expect(res).toEqual({
						direction: 'RelayToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0x45077b2263616c6c496e646578223a22307836333032222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b2270617261636861696e223a323030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d2c7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b2268657265223a6e756c6c7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a307d7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('SystemToRelay', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				format: T,
				isLimited: boolean,
				xcmVersion: number
			): Promise<TxResult<T>> => {
				return await systemAssetsApi.createTransferTransaction(
					'0', // `0` indicating the dest chain is a relay chain.
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['DOT'],
					['100'],
					{
						format,
						isLimited,
						xcmVersion,
					}
				);
			};
			describe('V2', () => {
				it('Should correctly build a teleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', false, 2);
					expect(res).toEqual({
						direction: 'SystemToRelay',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010100010400010000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', true, 2);
					expect(res).toEqual({
						direction: 'SystemToRelay',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010001040001000091010000000000',
						xcmVersion: 2,
					});
				});
			});
		});
		describe('RelayToSystem', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				format: T,
				isLimited: boolean,
				xcmVersion: number
			): Promise<TxResult<T>> => {
				return await relayAssetsApi.createTransferTransaction(
					'1000', // `0` indicating the dest chain is a relay chain.
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['100'],
					{
						format,
						isLimited,
						xcmVersion,
					}
				);
			};
			describe('V2', () => {
				it('Should correctly build a teleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', false, 2);
					expect(res).toEqual({
						direction: 'RelayToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x63010100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01000100a10f010400000000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx('call', true, 2);
					expect(res).toEqual({
						direction: 'RelayToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x63090100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01000100a10f01040000000091010000000000',
						xcmVersion: 2,
					});
				});
			});
		});
		describe('checkLocalTxInput', () => {
			it('Should error when the assetIds or amounts is the incorrect length', async () => {
				const err = async () =>
					await systemAssetsApi.createTransferTransaction(
						'1000',
						'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
						['1', '2'],
						['100', '100']
					);
				await expect(err()).rejects.toThrow(
					'Local transactions must have the `assetIds` input be a length of 1, and the `amounts` input be a length of 1'
				);
			});
		});
	});
});
