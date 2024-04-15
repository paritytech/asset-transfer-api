// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../AssetTransferApi';
import { CreateXcmCallOpts } from '../createXcmCalls/types';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApiV9420';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApiV1004000';
import { adjustedMockSystemApiV1009000 } from '../testHelpers/adjustedMockSystemApiV1009000';
import { adjustedMockWestendRelayApiV1007001 } from '../testHelpers/adjustedMockWestendRelayApiV1007001';
import type { Format, TxResult } from '../types';

const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2, { registryType: 'NPM' });
const relayAssetsApiV1007001 = new AssetTransferApi(adjustedMockWestendRelayApiV1007001, 'westend', 2, {
	registryType: 'NPM',
});
const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
const systemAssetsApiV1009000 = new AssetTransferApi(adjustedMockSystemApiV1009000, 'westmint', 2, {
	registryType: 'NPM',
});

describe('AssetTransferApi Integration Tests', () => {
	describe('createTransferTransaction', () => {
		describe('Local Asset Transfer', () => {
			it('Should construct a `assets::transfer` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['1'],
					['100'],
					{
						format: 'call',
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'assets::transfer',
					tx: '0x3208040078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `assets::transferKeepAlive` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['1'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'assets::transferKeepAlive',
					tx: '0x3209040078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `balances::transfer` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['KSM'],
					['100'],
					{
						format: 'call',
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'balances::transfer',
					tx: '0x0a000078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `balances::transferKeepAlive` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['KSM'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'balances::transferKeepAlive',
					tx: '0x0a030078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `balances::transfer` call on a relay chain', async () => {
				const res = await relayAssetsApi.createTransferTransaction(
					'0',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['KSM'],
					['100'],
					{
						format: 'call',
					},
				);
				expect(res).toEqual({
					dest: 'kusama',
					origin: 'kusama',
					direction: 'local',
					format: 'call',
					method: 'balances::transfer',
					tx: '0x04070078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `balances::transferKeepAlive` call on a relay chain', async () => {
				const res = await relayAssetsApi.createTransferTransaction(
					'0',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['KSM'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
					},
				);
				expect(res).toEqual({
					dest: 'kusama',
					origin: 'kusama',
					direction: 'local',
					format: 'call',
					method: 'balances::transferKeepAlive',
					tx: '0x04030078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `foreignAssets::transfer` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}'],
					['100'],
					{
						format: 'call',
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'foreignAssets::transfer',
					tx: '0x3508010200352105000078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `foreignAssets::transferKeepAlive` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'foreignAssets::transferKeepAlive',
					tx: '0x3509010200352105000078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
					xcmVersion: null,
				});
			});
			it('Should construct a `poolAssets::transfer` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['0'],
					['100'],
					{
						format: 'call',
						transferLiquidToken: true,
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'poolAssets::transfer',
					xcmVersion: null,
					tx: '0x3708000000000078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
				});
			});
			it('Should construct a `poolAssets::transferKeepAlive` call on a system parachain', async () => {
				const res = await systemAssetsApi.createTransferTransaction(
					'1000',
					'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
					['0'],
					['100'],
					{
						format: 'call',
						keepAlive: true,
						transferLiquidToken: true,
					},
				);
				expect(res).toEqual({
					dest: 'statemine',
					origin: 'statemine',
					direction: 'local',
					format: 'call',
					method: 'poolAssets::transferKeepAlive',
					xcmVersion: null,
					tx: '0x3709000000000078b39b0b6dd87cb68009eb570511d21c229bdb5e94129ae570e9b79442ba26659101',
				});
			});
		});
		describe('SystemToPara', () => {
			const foreignBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1', '2'],
					['100', '100'],
					{
						format,
						weightLimit: {
							refTime,
							proofSize,
						},
						xcmVersion,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['KSM'],
					['100'],
					{
						format,
						xcmVersion,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const nativeBaseSystemPaysWithFeeOriginAssetLocationCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['KSM'],
					['100'],
					{
						paysWithFeeOrigin: `{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`,
						format,
						xcmVersion,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const nativeBaseSystemPaysWithFeeOriginAssetIdCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['KSM'],
					['100'],
					{
						paysWithFeeOrigin: `1984`,
						format,
						xcmVersion,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const foreignAssetMultiLocationBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2023', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}'],
					['100'],
					{
						format,
						weightLimit: opts.weightLimit,
						xcmVersion,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};

			const foreignAssetMultiLocationBaseTeleportSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2125', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[`{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}`],
					['100'],

					{
						format,
						xcmVersion,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const liquidTokenTransferCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['0'],
					['100'],
					{
						format,
						weightLimit: {
							refTime: '1000',
							proofSize: '1000',
						},
						xcmVersion,
						transferLiquidToken: true,
					},
				);
			};
			describe('V2', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 2, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0x31011f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0x21011f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01080000020432050400910100000204320508009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 2, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0xe81f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 2, {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});

					expect(res.tx.toHex()).toEqual(
						'0xf81f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'moonriver',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001214e411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'payload', 2, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0x0d011f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001214e411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a liquid token transfer call for a limitedReserveTransferAssets for V2', async () => {
					const res = await liquidTokenTransferCreateTx(systemAssetsApi, 'call', 2);
					expect(res).toStrictEqual({
						dest: 'karura',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						origin: 'statemine',
						tx: '0x1f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000002043705000091010000000001a10fa10f',
						xcmVersion: 2,
					});
				});
				it('Should correctly construct a paysWithFeeOrigin tx for V2 using an assets location', async () => {
					const res = await nativeBaseSystemPaysWithFeeOriginAssetLocationCreateTx(systemAssetsApi, 'payload', 2, {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toStrictEqual(
						'0xf81f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010002043205011fcc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly construct a paysWithFeeOrigin tx for V2 using an assets id', async () => {
					const res = await nativeBaseSystemPaysWithFeeOriginAssetIdCreateTx(systemAssetsApi, 'payload', 2, {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toStrictEqual(
						'0xf81f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 3, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0x31011f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0x21011f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03080000020432050400910100000204320508009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedReserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 3, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0xe81f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedReserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001214ee12e',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for limitedReserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 3, {
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0xf81f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001214ee12e45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isAssetLocationTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'moonriver',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f08030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001214e411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'payload', 3, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0x0d011f08030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001214e411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'call', 3, {
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'tinkernet_node',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001411f214e',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM payload limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'payload', 3, {
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0x0d011f090301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001411f214e45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'call', 3, {
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'tinkernet_node',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM payload limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'payload', 3, {
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toHex()).toEqual(
						'0xfc1f090301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001020035210500009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isAssetLocationTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a liquid token transfer call for a limitedReserveTransferAssets for V3', async () => {
					const res = await liquidTokenTransferCreateTx(systemAssetsApi, 'call', 3);
					expect(res).toStrictEqual({
						dest: 'karura',
						direction: 'SystemToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						origin: 'statemine',
						tx: '0x1f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000002043705000091010000000001a10fa10f',
						xcmVersion: 3,
					});
				});
			});
			it('Should correctly construct a paysWithFeeOrigin tx for V3 using an assets id', async () => {
				const res = await nativeBaseSystemPaysWithFeeOriginAssetIdCreateTx(systemAssetsApi, 'payload', 3, {
					weightLimit: {
						refTime: '1000',
						proofSize: '2000',
					},
					isAssetLocationTransfer: false,
					isLiquidTokenTransfer: false,
				});
				expect(res.tx.toHex()).toStrictEqual(
					'0xf81f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				);
			});
			it('Should correctly construct a paysWithFeeOrigin tx for V3 using an assets location', async () => {
				const res = await nativeBaseSystemPaysWithFeeOriginAssetLocationCreateTx(systemAssetsApi, 'payload', 3, {
					weightLimit: {
						refTime: '1000',
						proofSize: '2000',
					},
					isAssetLocationTransfer: false,
					isLiquidTokenTransfer: false,
				});
				expect(res.tx.toHex()).toStrictEqual(
					'0xf81f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010002043205011fcc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				);
			});
		});

		describe('SystemToSystem', () => {
			const foreignBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'1001', // collectives system parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1', '2'],
					['100', '100'],
					{
						format,
						xcmVersion,
						weightLimit: {
							refTime,
							proofSize,
						},
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				assetId: string[],
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'1002', // bridge-hub system parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetId,
					['100'],
					{
						format,
						xcmVersion,
						weightLimit: {
							refTime,
							proofSize,
						},
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const foreignAssetMultiLocationBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				assetIds: string[],
				format: T,
				xcmVersion: number,
				opts: CreateXcmCallOpts,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'1002', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					['100'],
					{
						format,
						xcmVersion,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const statemineNativeAssetIdArr = ['KSM'];
			const statemineForeignAssetIdArr = [
				`{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}`,
			];

			describe('V2', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0901010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 2, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0x31011f0901010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedTeleportAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 2);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0901010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0x21011f0901010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01080000020432050400910100000204320508009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'call',
						2,
						'1000',
						'2000',
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0901010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'payload',
						2,
						'1000',
						'2000',
					);
					expect(res.tx.toHex()).toEqual(
						'0xf81f0901010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						2,
						'1000',
						'2000',
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'call', 2);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0901010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets payload for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0xe81f0901010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'call',
						2,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0801010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'payload',
						2,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toHex()).toEqual(
						'0x0d011f0801010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'submittable',
						2,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0903010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 3, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0x31011f0903010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedTeleportAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', 3);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0903010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V3 FOR TEST', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0x21011f0903010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03080000020432050400910100000204320508009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedTeleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'call', 3);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0903010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a limitedTeleportAssets  for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0xe81f0903010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedTeleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'call',
						3,
						'1000',
						'2000',
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f0903010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedTeleportAssets payload for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'payload',
						3,
						'1000',
						'2000',
					);
					expect(res.tx.toHex()).toEqual(
						'0xf81f0903010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						3,
						'1000',
						'2000',
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'call',
						3,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x1f0803010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'payload',
						3,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toHex()).toEqual(
						'0x0d011f0803010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'submittable',
						3,
						{
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isAssetLocationTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});

		describe('RelayToPara', () => {
			const baseRelayCreateTx = async <T extends Format>(
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await relayAssetsApi.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['100'],
					{
						format,

						xcmVersion,
						weightLimit: {
							refTime,
							proofSize,
						},
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			describe('V2', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V2', async () => {
					const res = await baseRelayCreateTx('call', 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x630801000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V2', async () => {
					const res = await baseRelayCreateTx('payload', 2, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xf8630801000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2', async () => {
					const res = await baseRelayCreateTx('submittable', 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedReserveTransferAssets call for V2', async () => {
					const res = await baseRelayCreateTx('call', 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x630801000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V2', async () => {
					const res = await baseRelayCreateTx('payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0xe8630801000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000000009101000000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a limitedReserveTransferAssets submittable extrinsic for V2', async () => {
					const res = await baseRelayCreateTx('submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAssets for V3', async () => {
					const res = await baseRelayCreateTx('call', 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x630803000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a limitedReserveTransferAssets for V3', async () => {
					const res = await baseRelayCreateTx('payload', 3, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xf8630803000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await baseRelayCreateTx('submittable', 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedReserveTransferAssets for V3', async () => {
					const res = await baseRelayCreateTx('call', 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'limitedReserveTransferAssets',
						tx: '0x630803000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedReserveTransferAssets payload for V3', async () => {
					const res = await baseRelayCreateTx('payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0xe8630803000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000000009101000000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await baseRelayCreateTx('submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('SystemToRelay', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'0', // `0` indicating the dest chain is a relay chain.
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['100'],
					{
						format,

						xcmVersion,
						weightLimit: {
							refTime,
							proofSize,
						},
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			describe('V2', () => {
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets payload for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0xdc1f090101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets payload for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 2, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xec1f090101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedTeleportAssets  payload for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0xdc1f090301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x1f090301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedTeleportAssets payload for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 3, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xec1f090301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V4', () => {
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'call', 4);
					expect(res).toEqual({
						dest: 'westend',
						origin: 'westmint',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'transferAssets',
						tx: '0x1f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040401000091010000000000',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a transferAssets payload for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'payload', 4);
					expect(res.tx.toHex()).toEqual(
						'0xd81f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b04040100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'call', 4, '1000', '2000');
					expect(res).toEqual({
						dest: 'westend',
						origin: 'westmint',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'transferAssets',
						tx: '0x1f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040401000091010000000001a10f411f',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a transferAssets payload for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'payload', 4, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xe81f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040401000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV1009000, 'submittable', 4, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('RelayToSystem', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				xcmVersion: number,
				refTime?: string,
				proofSize?: string,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'1000', // `0` indicating the dest chain is a relay chain.
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['100'],
					{
						format,

						xcmVersion,
						weightLimit: {
							refTime,
							proofSize,
						},
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			describe('V2', () => {
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', 2);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x630901000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets  payload for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', 2);
					expect(res.tx.toHex()).toEqual(
						'0xe8630901000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000000009101000000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x630901000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', 2, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xf8630901000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', 3);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x630903000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedTeleportAssets  payload for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', 3);
					expect(res.tx.toHex()).toEqual(
						'0xe8630903000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000000009101000000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'limitedTeleportAssets',
						tx: '0x630903000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', 3, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xf8630903000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V4', () => {
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'call', 4);
					expect(res).toEqual({
						dest: 'westmint',
						origin: 'westend',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'transferAssets',
						tx: '0x630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040400000091010000000000',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a transferAssets payload for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'payload', 4);
					expect(res.tx.toHex()).toEqual(
						'0xe4630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b04040000009101000000000045022800995d0f00180000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'submittable', 4);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'call', 4, '1000', '2000');
					expect(res).toEqual({
						dest: 'westmint',
						origin: 'westend',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'transferAssets',
						tx: '0x630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040400000091010000000001a10f411f',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'payload', 4, '1000', '2000');
					expect(res.tx.toHex()).toEqual(
						'0xf4630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040400000091010000000001a10f411f45022800995d0f00180000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
					);
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'submittable', 4, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('checkLocalTxInput', () => {
			it('Should error when the assetIds or amounts is the incorrect length', async () => {
				await expect(async () => {
					await relayAssetsApi.createTransferTransaction(
						'0',
						'5EnxxUmEbw8DkENKiYuZ1DwQuMoB2UWEQJZZXrTsxoz7SpgG',
						['1', '2'],
						['100', '100'],
					);
				}).rejects.toThrow(
					'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
				);
			});
		});
	});
	describe('claimAssets', () => {
		describe('AssetId Locations', () => {
			it('Should correctly construct a claimAssets call using a location assetId for XCM V4', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`],
					['100000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 4,
						format: 'call',
					},
				);

				expect(res).toEqual({
					dest: 'westmint',
					direction: 'local',
					format: 'call',
					method: 'claimAssets',
					origin: '1000',
					tx: '0x1f0c04040002043205011f000284d7170400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					xcmVersion: 4,
				});
			});
			it('Should correctly construct a claimAssets payload using multiple location assetIds for XCM V3', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[
						`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`,
						`{"parents":"1","interior":{"Here":""}}`,
					],
					['100000000', '2000000000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 3,
						format: 'payload',
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				expect(res.tx.toHex()).toEqual(
					'0x05011f0c0308000002043205011f000284d717000100000b00204aa9d1010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				);
			});
			it('Should correctly construct a claimAssets submittable using a location assetId for XCM V2', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`],
					['200000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 2,
						format: 'submittable',
					},
				);

				expect(res.tx.toRawType()).toEqual('Extrinsic');
			});
		});
		describe('AssetId Symbols', () => {
			it('Should correctly construct a claimAssets call using a symbol assetId for XCM V4', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`usdt`],
					['100000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 4,
						format: 'call',
					},
				);

				expect(res).toEqual({
					dest: 'westmint',
					direction: 'local',
					format: 'call',
					method: 'claimAssets',
					origin: '1000',
					tx: '0x1f0c040400020432050901000284d7170400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					xcmVersion: 4,
				});
			});
			it('Should correctly construct a claimAssets payload using multiple symbol assetIds for XCM V3', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`usdt`, `wnd`],
					['100000000', '2000000000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 3,
						format: 'payload',
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				expect(res.tx.toHex()).toEqual(
					'0x05011f0c03080000020432050901000284d717000100000b00204aa9d1010300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				);
			});
			it('Should correctly construct a claimAssets submittable using a symbol assetId for XCM V2', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`usdc`],
					['200000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 2,
						format: 'submittable',
					},
				);

				expect(res.tx.toRawType()).toEqual('Extrinsic');
			});
			it('Should correctly construct a claimAssets payload using a liquidity pool token assetId', async () => {
				const res = await systemAssetsApiV1009000.claimAssets(
					[`52`],
					['200000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 2,
						transferLiquidToken: true,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
						format: 'payload',
					},
				);

				expect(res.tx.toHex()).toEqual(
					'0xd41f0c0104000002043705d0000208af2f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				);
			});
		});
		it('Should correctly error when mixing both a location and symbol assetId', async () => {
			await expect(async () => {
				await systemAssetsApiV1009000.claimAssets(
					[`{"parents":"1","interior":{"Here":""}}`, `usdt`],
					['2000000000', '100000000'],
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					{
						xcmVersion: 4,
						format: 'call',
					},
				);
			}).rejects.toThrow(
				`Found both symbol usdt and multilocation assetId {"parents":"1","interior":{"Here":""}}. Asset Ids must be symbol and integer or multilocation exclusively.`,
			);
		});
	});
});
