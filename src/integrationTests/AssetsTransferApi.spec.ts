// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../AssetTransferApi';
import { CreateXcmCallOpts } from '../createXcmCalls/types';
import { adjustedMockRelayApi } from '../testHelpers/adjustedMockRelayApiV9420';
import { adjustedMockSystemApi } from '../testHelpers/adjustedMockSystemApiV1004000';
import { adjustedMockSystemApiV1007000 } from '../testHelpers/adjustedMockSystemApiV1007000';
import { adjustedMockWestendRelayApiV1007001 } from '../testHelpers/adjustedMockWestendRelayApiV1007001';
import type { Format, TxResult } from '../types';

const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2, { registryType: 'NPM' });
const relayAssetsApiV1007001 = new AssetTransferApi(adjustedMockWestendRelayApiV1007001, 'westend', 2, {
	registryType: 'NPM',
});
const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
const systemAssetsApiV100700 = new AssetTransferApi(adjustedMockSystemApiV1007000, 'westmint', 2, {
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
		describe('SystemToBridge', () => {
			// const bridgeBaseSystemCreateTx = async <T extends Format>(
			// 	ataAPI: AssetTransferApi,
			// 	format: T,
			// 	isLimited: boolean,
			// 	xcmVersion: number,
			// 	refTime?: string,
			// 	proofSize?: string,
			// ): Promise<TxResult<T>> => {
			// 	return await ataAPI.createTransferTransaction(
			// 		`{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // Since this is not `0` we know this is to a parachain
			// 		'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			// 		[`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`],
			// 		['1000000000'],
			// 		{
			// 			format,
			// 			isLimited,
			// 			weightLimit: {
			// 				refTime,
			// 				proofSize,
			// 			},
			// 			xcmVersion,
			// 			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			// 		},
			// 	);
			// };

			describe('V4', () => {
				// TODO
			});
		});
		describe('SystemToPara', () => {
			const foreignBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				isLimited: boolean,
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
						isLimited,
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
						isLimited: opts.isLimited,
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
						isLimited: opts.isLimited,
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
						isLimited: opts?.isLimited,
						weightLimit: opts.weightLimit,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			};
			const liquidTokenTransferCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				isLimited: boolean,
				xcmVersion: number,
			): Promise<TxResult<T>> => {
				return await ataAPI.createTransferTransaction(
					'2000', // Since this is not `0` we know this is to a parachain
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['0'],
					['100'],
					{
						format,
						isLimited,
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
				it('Should correctly build a call for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', true, 2, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', true, 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x31011f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', false, 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f0201010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0108000002043205040091010000020432050800910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', false, 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0x1d011f0201010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f0201010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 2, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0xe41f0201010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
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
						isLimited: true,
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});

					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xf81f0801010100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'call', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
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
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'payload', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'moonriver',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x0d011f08010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001214e411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a liquid token transfer call for a limitedReserveTransferAsset for V2', async () => {
					const res = await liquidTokenTransferCreateTx(systemAssetsApi, 'call', true, 2);
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
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', true, 3, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', true, 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x31011f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', false, 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f0203010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0308000002043205040091010000020432050800910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', false, 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0x1d011f0203010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x1f0203010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a reserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', 3, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0xe41f0203010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedReserveTransferAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isForeignAssetsTransfer: false,
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
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'karura',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xf81f0803010100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001214ee12e45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '3000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'call', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: true,
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
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'payload', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'moonriver',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x0d011f08030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001214e411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(systemAssetsApi, 'submittable', 2, {
						isLimited: true,
						weightLimit: {
							refTime: '5000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'call', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isForeignAssetsTransfer: true,
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
						isLimited: true,
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'tinkernet_node',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0x0d011f090301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001411f214e45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM submittable limitedTeleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isLimited: true,
						weightLimit: {
							refTime: '2000',
							proofSize: '5000',
						},
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a foreign asset XCM call teleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'call', 3, {
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'tinkernet_node',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f010301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000102003521050000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM payload teleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'payload', 3, {
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res).toEqual({
						dest: 'tinkernet_node',
						origin: 'statemine',
						direction: 'SystemToPara',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xf81f010301010035210300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM submittable teleportAssets for V3', async () => {
					const res = await foreignAssetMultiLocationBaseTeleportSystemCreateTx(systemAssetsApi, 'submittable', 3, {
						isForeignAssetsTransfer: true,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a liquid token transfer call for a limitedReserveTransferAsset for V3', async () => {
					const res = await liquidTokenTransferCreateTx(systemAssetsApi, 'call', true, 3);
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
		});

		describe('SystemToSystem', () => {
			const foreignBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				isLimited: boolean,
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
						isLimited,
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
				isLimited: boolean,
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
						isLimited,
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
						isLimited: opts?.isLimited,
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
				it('Should correctly build a call for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', true, 2, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', true, 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0x31011f0901010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', false, 2);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f0101010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0108000002043205040091010000020432050800910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', false, 2);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0x1d011f0101010100a50f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010800000204320504009101000002043205080091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'call',
						true,
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
						true,
						2,
						'1000',
						'2000',
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xf81f0901010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						true,
						2,
						'1000',
						'2000',
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for teleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'call', false, 2);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f0101010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for teleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'payload', false, 2);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xe41f0101010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V2 when its a native token', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						false,
						2,
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'call',
						2,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
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
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'payload',
						2,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x0d011f0801010100a90f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200352105000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'submittable',
						2,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', true, 3, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', true, 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0x31011f0903010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'call', false, 3);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f0103010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0308000002043205040091010000020432050800910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V3 FOR TEST', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'payload', false, 3);
					expect(res).toEqual({
						dest: 'encointer-parachain',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0x1d011f0103010100a50f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030800000204320504009101000002043205080091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAssets for V3', async () => {
					const res = await foreignBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a teleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'call', false, 3);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f0103010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a teleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, statemineNativeAssetIdArr, 'payload', false, 3);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xe41f0103010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						false,
						3,
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for limitedTeleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'call',
						true,
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
				it('Should correctly build a payload for limitedTeleportAssets for V3 when the token is native', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'payload',
						true,
						3,
						'1000',
						'2000',
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xf81f0903010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(
						systemAssetsApi,
						statemineNativeAssetIdArr,
						'submittable',
						true,
						3,
						'1000',
						'2000',
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});

				it('Should correctly build a foreign asset XCM call for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'call',
						3,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
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
				it('Should correctly build a foreign asset XCM payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'payload',
						3,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res).toEqual({
						dest: 'bridge-hub-kusama',
						origin: 'statemine',
						direction: 'SystemToSystem',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0x0d011f0803010100a90f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010200352105000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a foreign asset XCM submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await foreignAssetMultiLocationBaseSystemCreateTx(
						systemAssetsApi,
						statemineForeignAssetIdArr,
						'submittable',
						3,
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: true,
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
				isLimited: boolean,
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
						isLimited,
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
				it('Should correctly build a call for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('call', true, 2, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('payload', true, 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xf8630801000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('submittable', true, 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('call', false, 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x630201000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400000000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('payload', false, 2);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0xe4630201000100411f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAsset for V2', async () => {
					const res = await baseRelayCreateTx('submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a call for a limitedReserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('call', true, 3, '1000', '2000');
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
				it('Should correctly build a payload for a limitedReserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('payload', true, 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'payload',
						method: 'limitedReserveTransferAssets',
						tx: '0xf8630803000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedReserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('submittable', true, 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a call for a reserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('call', false, 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'call',
						method: 'reserveTransferAssets',
						tx: '0x630203000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400000000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a payload for a reserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('payload', false, 3);
					expect(res).toEqual({
						dest: 'karura',
						origin: 'kusama',
						direction: 'RelayToPara',
						format: 'payload',
						method: 'reserveTransferAssets',
						tx: '0xe4630203000100411f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a reserveTransferAsset for V3', async () => {
					const res = await baseRelayCreateTx('submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('SystemToRelay', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				isLimited: boolean,
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
						isLimited,
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
				it('Should correctly build a teleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', false, 2);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f010101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a teleportAssets payload for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', false, 2);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xd81f010101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', true, 2, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', true, 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xec1f090101000100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a teleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', false, 3);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x1f010301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a teleportAssets payload for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', false, 3);
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xd81f010301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'call', true, 3, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'payload', true, 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'kusama',
						origin: 'statemine',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xec1f090301000300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040001000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApi, 'submittable', true, 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V4', () => {
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'call', false, 4);
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
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'payload', false, 4);
					expect(res).toEqual({
						dest: 'westend',
						origin: 'westmint',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'transferAssets',
						tx: '0xd81f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b04040100009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'call', true, 4, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'payload', true, 4, '1000', '2000');
					expect(res).toEqual({
						dest: 'westend',
						origin: 'westmint',
						direction: 'SystemToRelay',
						format: 'payload',
						method: 'transferAssets',
						tx: '0xe81f0b0401000400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040401000091010000000001a10f411f45022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(systemAssetsApiV100700, 'submittable', true, 4, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('RelayToSystem', () => {
			const nativeBaseSystemCreateTx = async <T extends Format>(
				ataAPI: AssetTransferApi,
				format: T,
				isLimited: boolean,
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
						isLimited,
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
				it('Should correctly build a teleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', false, 2);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x630101000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400000000910100000000',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a teleportAssets payload for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', false, 2);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xe4630101000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', false, 2);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', true, 2, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', true, 2, '1000', '2000');
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xf8630901000100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 2,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V2', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', true, 2, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V3', () => {
				it('Should correctly build a teleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', false, 3);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'call',
						method: 'teleportAssets',
						tx: '0x630103000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400000000910100000000',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a teleportAssets payload for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', false, 3);
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'teleportAssets',
						tx: '0xe4630103000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000045022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a teleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', false, 3);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a limitedTeleportAssets call for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'call', true, 3, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'payload', true, 3, '1000', '2000');
					expect(res).toEqual({
						dest: 'statemine',
						origin: 'kusama',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'limitedTeleportAssets',
						tx: '0xf8630903000100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b03040000000091010000000001a10f411f45022800cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 3,
					});
				});
				it('Should correctly build a submittable extrinsic for a limitedTeleportAssets for V3', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApi, 'submittable', true, 3, '1000', '2000');
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('V4', () => {
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'call', false, 4);
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
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'payload', false, 4);
					expect(res).toEqual({
						dest: 'westmint',
						origin: 'westend',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'transferAssets',
						tx: '0xe4630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b04040000009101000000000045022800995d0f00180000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'submittable', false, 4);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly build a transferAssets call for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'call', true, 4, '1000', '2000');
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
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'payload', true, 4, '1000', '2000');
					expect(res).toEqual({
						dest: 'westmint',
						origin: 'westend',
						direction: 'RelayToSystem',
						format: 'payload',
						method: 'transferAssets',
						tx: '0xf4630b04000100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b040400000091010000000001a10f411f45022800995d0f00180000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						xcmVersion: 4,
					});
				});
				it('Should correctly build a submittable extrinsic for a transferAssets for V4', async () => {
					const res = await nativeBaseSystemCreateTx(relayAssetsApiV1007001, 'submittable', true, 4, '1000', '2000');
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
});
