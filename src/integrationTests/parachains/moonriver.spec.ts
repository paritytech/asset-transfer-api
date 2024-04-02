// Copyright 2023 Parity Technologies (UK) Ltd.

import type { GenericExtrinsicPayload } from '@polkadot/types/extrinsic';

import { AssetTransferApi } from '../../AssetTransferApi';
import { adjustedMockMoonriverParachainApi } from '../../testHelpers/adjustedMockMoonriverParachainApi';
import type { Format } from '../../types';
import type { TestMultiassetsWithFormat, TestMultiassetWithFormat } from '../util';
import { paraTransferMultiasset as moonriverTransferMultiasset } from '../util';
import { paraTransferMultiassets as moonriverTransferMultiassets } from '../util';
import { paraTransferMultiassetWithFee as moonriverTransferMultiassetWithFee } from '../util';
import { paraTeleportNativeAsset as moonriverTeleportNativeAsset } from '../util';

const moonriverATA = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'moonriver', 2, { registryType: 'NPM' });

describe('Moonriver', () => {
	describe('ParaToPara', () => {
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2001',
							'319623561105283008236062145480775032445', // xcBNC
							'call',
							'0x6a010100010200451f06080001000700e40b540201010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
						],
						[
							'2001',
							'vBNC',
							'call',
							'0x6a010100010200451f06080101000700e40b540201010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
						],
						[
							'2001',
							'vmovr',
							'payload',
							'0x05016a010100010200451f0608010a000700e40b540201010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503'
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 submittable transferMultiasset', async () => {
					const res = await moonriverTransferMultiasset(moonriverATA, 'submittable', 2, '2001', 'MOVR', {
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
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2004',
							'PHA',
							'call',
							'0x6a010300010100511f000700e40b540203010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
						],
						[
							'2007',
							'16797826370226091782818345603793389938', // SDN
							'payload',
							'0xf46a0103000101005d1f000700e40b5402030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503'
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 submittable transferMultiasset', async () => {
					const res = await moonriverTransferMultiasset(moonriverATA, 'submittable', 3, '2001', 'ksm', {
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
			});
		});
		describe('transferMultiassets', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassets txs from Moonriver', async () => {
					const tests: TestMultiassetsWithFormat[] = [
						[
							'2001',
							['319623561105283008236062145480775032445', 'vMOVR'], // xcBNC, vMOVR
							['10000000000', '10000000000'],
							'call',
							'0x6a05010800010200451f06080001000700e40b540200010200451f0608010a000700e40b54020000000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
						],
						[
							'2001',
							['vBNC', 'bnc'],
							['10000000000', '10000000000'],
							'call',
							'0x6a05010800010200451f06080001000700e40b540200010200451f06080101000700e40b54020000000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f'
						],
						[
							'2001',
							['vmovr', 'vbnc'],
							['10000000000', '10000000000'],
							'payload',
							'0x5d016a05010800010200451f06080101000700e40b540200010200451f0608010a000700e40b54020000000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503'
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, format, expectedResult] = test;
						const res = await moonriverTransferMultiassets(
							moonriverATA,
							format as Format,
							2,
							paraId,
							assetIds,
							amounts,
							{
								isLimited: true,
								weightLimit: {
									refTime: '1000',
									proofSize: '2000',
								},
								isForeignAssetsTransfer: false,
								isLiquidTokenTransfer: false,
							},
						);

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 submittable transferMultiassets', async () => {
					const res = await moonriverTransferMultiassets(
						moonriverATA,
						'submittable',
						2,
						'2001',
						['vmovr', 'vksm'],
						['10000000000', '10000000000'],
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassets txs from Moonriver', async () => {
					const tests: TestMultiassetsWithFormat[] = [
						[
							'2007',
							['ksm', 'sdn'],
							['10000000000', '10000000000'],
							'call',
							'0x6a050308000100000700e40b5402000101005d1f000700e40b540200000000030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2004',
							['pha', 'ksm'],
							['10000000000', '10000000000'],
							'call',
							'0x6a050308000100000700e40b540200010100511f000700e40b54020000000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2106',
							['ksm', 'lit'],
							['10000000000', '10000000000'],
							'payload',
							'0x39016a050308000100000700e40b540200010200e920040a000700e40b54020000000003010200e9200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, format, expectedResult] = test;
						const res = await moonriverTransferMultiassets(
							moonriverATA,
							format as Format,
							3,
							paraId,
							assetIds,
							amounts,
							{
								isLimited: true,
								weightLimit: {
									refTime: '1000',
									proofSize: '2000',
								},
								isForeignAssetsTransfer: false,
								isLiquidTokenTransfer: false,
							},
						);

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 submittable transferMultiassets', async () => {
					const res = await moonriverTransferMultiassets(
						moonriverATA,
						'submittable',
						3,
						'2001',
						['sdn', 'ksm'],
						['10000000000', '10000000000'],
						{
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						},
					);
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('transferMultiassetWithFee', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2001',
							'319623561105283008236062145480775032445', // xcBNC
							'call',
							'0x6a030100010200451f06080001000700e40b54020100010300a10f043205011f000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2001',
							'vBNC',
							'call',
							'0x6a030100010200451f06080101000700e40b54020100010300a10f043205011f000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2001',
							'vmovr',
							'payload',
							'0x3d016a030100010200451f0608010a000700e40b54020100010300a10f043205011f000001010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiassetWithFee(moonriverATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 submittable transferMultiassetWithFee', async () => {
					const res = await moonriverTransferMultiassetWithFee(moonriverATA, 'submittable', 2, '2001', 'ksm', {
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
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2001',
							'ksm',
							'call',
							'0x6a0303000100000700e40b54020300010300a10f043205011f000003010200451f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2004',
							'pha',
							'call',
							'0x6a030300010100511f000700e40b54020300010300a10f043205011f000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'2106',
							'lit',
							'payload',
							'0x35016a030300010200e920040a000700e40b54020300010300a10f043205011f000003010200e9200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiassetWithFee(moonriverATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 submittable transferMultiassetWithFee', async () => {
					const res = await moonriverTransferMultiassetWithFee(moonriverATA, 'submittable', 3, '2001', 'ksm', {
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
			});
		});
	});
	describe('ParaToSystem', () => {
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'xcKSM',
							'call',
							'0x6a0101000100000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcUSDT',
							'payload',
							'0x09016a010100010300a10f043205011f000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
						[
							'1000',
							'xcRMRK',
							'payload',
							'0x05016a010100010300a10f04320520000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'xcKSM',
							'call',
							'0x6a0103000100000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcUSDT',
							'call',
							'0x6a010300010300a10f043205011f000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcRMRK',
							'call',
							'0x6a010300010300a10f04320520000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx).toEqual(expectedResult);
					}
				});
			});
		});
		describe('transferMultiassets', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassets txs from Moonriver', async () => {
					const tests: TestMultiassetsWithFormat[] = [
						[
							'1000',
							['xcKSM', 'xcUSDT'],
							['10000000000', '10000000000'],
							'call',
							'0x6a050108000100000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							['xcUSDT', 'xcRMRK'],
							['10000000000', '10000000000'],
							'payload',
							'0x61016a05010800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
						[
							'1000',
							['xcRMRK', 'xcKSM'],
							['10000000000', '10000000000'],
							'payload',
							'0x41016a050108000100000700e40b540200010300a10f04320520000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, format, expectedResult] = test;
						const res = await moonriverTransferMultiassets(
							moonriverATA,
							format as Format,
							2,
							paraId,
							assetIds,
							amounts,
							{
								isLimited: true,
								weightLimit: {
									refTime: '1000',
									proofSize: '2000',
								},
								isForeignAssetsTransfer: false,
								isLiquidTokenTransfer: false,
							},
						);

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassets txs from Moonriver', async () => {
					const tests: TestMultiassetsWithFormat[] = [
						[
							'1000',
							['xcKSM', 'xcUSDT'],
							['10000000000', '10000000000'],
							'call',
							'0x6a050308000100000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							['xcUSDT', 'xcRMRK'],
							['10000000000', '10000000000'],
							'payload',
							'0x61016a05030800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
						[
							'1000',
							['xcRMRK', 'xcKSM'],
							['10000000000', '10000000000'],
							'payload',
							'0x41016a050308000100000700e40b540200010300a10f04320520000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, format, expectedResult] = test;
						const res = await moonriverTransferMultiassets(
							moonriverATA,
							format as Format,
							3,
							paraId,
							assetIds,
							amounts,
							{
								isLimited: true,
								weightLimit: {
									refTime: '1000',
									proofSize: '2000',
								},
								isForeignAssetsTransfer: false,
								isLiquidTokenTransfer: false,
							},
						);

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
			});
		});
		describe('transferMultiassetWithFee', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'xcKSM',
							'call',
							'0x6a0301000100000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcUSDT',
							'payload',
							'0x41016a030100010300a10f043205011f000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
						[
							'1000',
							'xcRMRK',
							'payload',
							'0x3d016a030100010300a10f04320520000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiassetWithFee(moonriverATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'xcKSM',
							'call',
							'0x6a0303000100000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcUSDT',
							'call',
							'0x6a030300010300a10f043205011f000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'1000',
							'xcRMRK',
							'call',
							'0x6a030300010300a10f04320520000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiassetWithFee(moonriverATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx).toEqual(expectedResult);
					}
				});
			});
		});
		describe('limitedTeleportAssets', () => {
			describe('XCM V2', () => {
				it('Should correctly construct a limitedTeleportAssets call when sending Moonrivers primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'MOVR',
							'call',
							'0x6a0101000000000700e40b540201010200a10f01007369626c2708000000000000000000000000000000000000000000000000000001a10f411f',
						],
						[
							'1000',
							'MOVR',
							'payload',
							'0xe86a0101000000000700e40b540201010200a10f01007369626c2708000000000000000000000000000000000000000000000000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await moonriverTeleportNativeAsset(moonriverATA, format as Format, assetId, 2, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 limitedTeleportAssets submittable containing the native parachain asset', async () => {
					const res = await moonriverTeleportNativeAsset(moonriverATA, 'submittable', 'MOVR', 2, {
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
			});
			describe('XCM V3', () => {
				it('Should correctly construct a limitedTeleportAssets call when sending Moonrivers primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'MOVR',
							'call',
							'0x6a0103000000000700e40b540203010200a10f01007369626c2708000000000000000000000000000000000000000000000000000001a10f411f',
						],
						[
							'1000',
							'MOVR',
							'payload',
							'0xe86a0103000000000700e40b540203010200a10f01007369626c2708000000000000000000000000000000000000000000000000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await moonriverTeleportNativeAsset(moonriverATA, format as Format, assetId, 3, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 limitedTeleportAssets submittable containing the native parachain asset', async () => {
					const res = await moonriverTeleportNativeAsset(moonriverATA, 'submittable', 'MOVR', 3, {
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
			});
		});
		describe('teleportAssets', () => {
			describe('XCM V2', () => {
				it('Should correctly construct a teleportAssets call when sending Moonrivers primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'MOVR',
							'call',
							'0x6a0101000000000700e40b540201010200a10f01007369626c2708000000000000000000000000000000000000000000000000000000',
						],
						[
							'1000',
							'MOVR',
							'payload',
							'0xd86a0101000000000700e40b540201010200a10f01007369626c270800000000000000000000000000000000000000000000000000000045022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await moonriverTeleportNativeAsset(moonriverATA, format as Format, assetId, 2, {
							isLimited: false,
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 teleportAssets submittable containing the native parachain asset', async () => {
					const res = await moonriverTeleportNativeAsset(moonriverATA, 'submittable', 'MOVR', 2, {
						isLimited: false,
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V3', () => {
				it('Should correctly construct a teleportAssets call when sending Moonrivers primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'MOVR',
							'call',
							'0x6a0103000000000700e40b540203010200a10f01007369626c2708000000000000000000000000000000000000000000000000000000',
						],
						[
							'1000',
							'MOVR',
							'payload',
							'0xd86a0103000000000700e40b540203010200a10f01007369626c270800000000000000000000000000000000000000000000000000000045022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await moonriverTeleportNativeAsset(moonriverATA, format as Format, assetId, 3, {
							isLimited: false,
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 teleportAssets submittable containing the native parachain asset', async () => {
					const res = await moonriverTeleportNativeAsset(moonriverATA, 'submittable', 'MOVR', 3, {
						isLimited: false,
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
	});
	describe('ParaToRelay', () => {
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'xcKSM',
							'call',
							'0x6a0101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'42259045809535163221576417993425387648',
							'call',
							'0x6a0101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'ksm',
							'payload',
							'0xdc6a0101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V2 submittable transferMultiasset', async () => {
					const res = await moonriverTransferMultiasset(moonriverATA, 'submittable', 2, '0', 'ksm', {
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
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'ksm',
							'call',
							'0x6a0103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'42259045809535163221576417993425387648', // SDN
							'payload',
							'0xdc6a0103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await moonriverTransferMultiasset(moonriverATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						if (format === 'call') {
							expect(res.tx).toEqual(expectedResult);
						} else {
							expect((res.tx as GenericExtrinsicPayload).toHex()).toEqual(expectedResult);
						}
					}
				});
				it('Should correctly build a V3 submittable transferMultiasset', async () => {
					const res = await moonriverTransferMultiasset(moonriverATA, 'submittable', 3, '0', 'ksm', {
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
			});
		});
	});
});
