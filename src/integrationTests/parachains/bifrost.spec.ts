// Copyright 2023 Parity Technologies (UK) Ltd.

import type { GenericExtrinsicPayload } from '@polkadot/types/extrinsic';

import { AssetTransferApi } from '../../AssetTransferApi';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi';
import type { Format } from '../../types';
import type { TestMultiasset, TestMultiassets, TestMultiassetWithFormat } from '../util';
import { paraTransferMultiasset as bifrostTransferMultiasset } from '../util';
import { paraTransferMultiassets as bifrostTransferMultiassets } from '../util';
import { paraTransferMultiassetWithFee as bifrostTransferMultiassetWithFee } from '../util';
import { paraTransferAssets as bifrostTransferAssets } from '../util';

const bifrostATA = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 2, { registryType: 'NPM' });

describe('Bifrost', () => {
	describe('ParaToPara', () => {
		describe('transferAssets', () => {
			describe('XCM V2', () => {
				it('Should correctly construct a transferAssets call from Bifrost to Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2023',
							'vKSM',
							'call',
							'0x290b010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200451f0608010400025a62020000000000',
						],
						[
							'2023',
							'vBNC',
							'payload',
							'0x0d01290b010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200451f0608010100025a620200000000004502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							2,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V2 transferAssets submittable', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 2, '2023', ['vKSM'], ['10000000'], {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V3', () => {
				it('Should correctly construct a transferAssets call from Bifrost to Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2023',
							'movr',
							'call',
							'0x290b030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000102009d1f040a00025a62020000000000',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							3,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V3 transferAssets submittable from Bifrost to Moonriver', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 3, '2023', ['BNC'], ['10000000'], {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V4', () => {
				it('Should correctly construct a transferAssets call from Bifrost to Moonriver', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'2023',
							'movr',
							'call',
							'0x290b040101009d1f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b04040102009d1f040a00025a62020000000000',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							4,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V4 transferAssets submittable from Bifrost to Moonriver', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 4, '2023', ['BNC'], ['10000000'], {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
		});
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'bnc',
							'0xe8460101000000000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vbnc',
							'0x050146010100010200451f06080101000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'movr',
							'0xfc460101000102009d1f040a000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vmovr',
							'0x050146010100010200451f0608010a000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'ksm',
							'0xe8460101000100000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vksm',
							'0x050146010100010200451f06080104000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2092',
							'kint',
							'0x050146010100010200b1200608000c000700e40b540201010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2000',
							'kar',
							'0x050146010100010200411f06080080000700e40b540201010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2004',
							'pha',
							'0xf446010100010100511f000700e40b540201010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 2, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});

			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'bnc',
							'0xe8460103000000000700e40b5402030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2007',
							'sdn',
							'0xf4460103000101005d1f000700e40b5402030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'movr',
							'0xfc460103000102009d1f040a000700e40b5402030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'ksm',
							'0xe8460103000100000700e40b5402030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2004',
							'pha',
							'0xf446010300010100511f000700e40b540203010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 3, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});
		describe('transferMultiassets', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassets txs from Bifrost Kusama', async () => {
					const tests: TestMultiassets[] = [
						[
							'2023',
							['vmovr', 'movr'],
							['10000000000', '10000000000'],
							'0x55014605010800010200451f0608010a000700e40b5402000102009d1f040a000700e40b540200000000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2092',
							['kint', 'kbtc'],
							['10000000000', '10000000000'],
							'0x5d014605010800010200b1200608000b000700e40b540200010200b1200608000c000700e40b54020000000001010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2000',
							['kar', 'kusd'],
							['10000000000', '10000000000'],
							'0x5d014605010800010200411f06080080000700e40b540200010200411f06080081000700e40b54020000000001010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 2, paraId, assetIds, amounts, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});

			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassets txs from Bifrost Kusama', async () => {
					const tests: TestMultiassets[] = [
						[
							'2023',
							['ksm', 'movr'],
							['10000000000', '10000000000'],
							'0x390146050308000100000700e40b5402000102009d1f040a000700e40b540200000000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2007',
							['ksm', 'sdn'],
							['10000000000', '10000000000'],
							'0x310146050308000100000700e40b5402000101005d1f000700e40b540200000000030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2004',
							['ksm', 'pha'],
							['10000000000', '10000000000'],
							'0x310146050308000100000700e40b540200010100511f000700e40b54020000000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 3, paraId, assetIds, amounts, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});

		describe('transferMultiassetWithFee', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'bnc',
							'0x2101460301000000000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vbnc',
							'0x3d0146030100010200451f06080101000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'movr',
							'0x3501460301000102009d1f040a000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vmovr',
							'0x3d0146030100010200451f0608010a000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'ksm',
							'0x2101460301000100000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'vksm',
							'0x3d0146030100010200451f06080104000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2092',
							'kint',
							'0x3d0146030100010200b1200608000c000700e40b54020100010300a10f043205011f000001010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2000',
							'kar',
							'0x3d0146030100010200411f06080080000700e40b54020100010300a10f043205011f000001010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2004',
							'pha',
							'0x2d0146030100010100511f000700e40b54020100010300a10f043205011f000001010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 2, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'movr',
							'0x3501460303000102009d1f040a000700e40b54020300010300a10f043205011f0000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2023',
							'ksm',
							'0x2101460303000100000700e40b54020300010300a10f043205011f0000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'2004',
							'pha',
							'0x2d0146030300010100511f000700e40b54020300010300a10f043205011f000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 3, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});
	});
	describe('ParaToSystem', () => {
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							'0xe8460101000100000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'rmrk',
							'0x050146010100010300a10f04320520000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'usdt',
							'0x090146010100010300a10f043205011f000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 2, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							'0xe8460103000100000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'rmrk',
							'0x050146010300010300a10f04320520000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'usdt',
							'0x090146010300010300a10f043205011f000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 3, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});
		describe('transferMultiassets', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassets txs from Bifrost Kusama', async () => {
					const tests: TestMultiassets[] = [
						[
							'1000',
							['ksm', 'rmrk'],
							['10000000000', '10000000000'],
							'0x410146050108000100000700e40b540200010300a10f04320520000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							['rmrk', 'usdt'],
							['10000000000', '10000000000'],
							'0x61014605010800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							['ksm', 'usdt'],
							['10000000000', '10000000000'],
							'0x450146050108000100000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 2, paraId, assetIds, amounts, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassets txs from Bifrost Kusama', async () => {
					const tests: TestMultiassets[] = [
						[
							'1000',
							['ksm', 'rmrk'],
							['10000000000', '10000000000'],
							'0x410146050308000100000700e40b540200010300a10f04320520000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							['rmrk', 'usdt'],
							['10000000000', '10000000000'],
							'0x61014605030800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							['ksm', 'usdt'],
							['10000000000', '10000000000'],
							'0x450146050308000100000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 3, paraId, assetIds, amounts, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});
		describe('transferMultiassetWithFee', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							'0x2101460301000100000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'rmrk',
							'0x3d0146030100010300a10f04320520000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'usdt',
							'0x410146030100010300a10f043205011f000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 2, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							'0x2101460303000100000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'rmrk',
							'0x3d0146030300010300a10f04320520000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
						[
							'1000',
							'usdt',
							'0x410146030300010300a10f043205011f000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 3, paraId, assetId, {
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res.tx.toHex()).toEqual(expectedResult);
					}
				});
			});
		});
		describe('transferAssets', () => {
			describe('XCM V2', () => {
				it('Should correctly construct a transferAssets call from Bifrost to AssetHub', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'vKSM',
							'call',
							'0x290b01010100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200451f0608010400025a62020000000000',
						],
						[
							'1000',
							'vBNC',
							'payload',
							'0x0d01290b01010100a10f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b010400010200451f0608010100025a620200000000004502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							2,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V2 transferAssets submittable', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 2, '1000', ['vKSM'], ['10000000'], {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V3', () => {
				it('Should correctly construct a transferAssets call from Bifrost to AssetHub', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'USDT',
							'call',
							'0x290b03010100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010300a10f043205011f00025a62020000000000',
						],
						[
							'1000',
							'RMRK',
							'payload',
							'0x0d01290b03010100a10f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b030400010300a10f0432052000025a620200000000004502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							3,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V3 transferAssets submittable from Bifrost to AssetHub', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 3, '1000', ['KSM'], ['10000000'], {
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V4', () => {
				it('Should correctly construct a transferAssets call from Bifrost to AssetHub', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'bnc',
							'call',
							'0x290b04010100a10f0400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0404000000025a62020000000000',
						],
					];

					for (const test of tests) {
						const [destChainId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferAssets(
							bifrostATA,
							format as Format,
							4,
							destChainId,
							[assetId],
							['10000000'],
							{
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
				it('Should correctly build a V3 transferAssets submittable from Bifrost to Moonriver', async () => {
					const res = await bifrostTransferAssets(bifrostATA, 'submittable', 4, '1000', ['BNC'], ['10000000'], {
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
				it('Should correctly build xTokens transferMultiasset txs from Bifrost', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'xcKSM',
							'call',
							'0x460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'42259045809535163221576417993425387648',
							'call',
							'0x460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'ksm',
							'payload',
							'0xdc460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, format as Format, 2, paraId, assetId, {
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
					const res = await bifrostTransferMultiasset(bifrostATA, 'submittable', 2, '0', 'ksm', {
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
				it('Should correctly build xTokens transferMultiasset txs from Bifrost', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'ksm',
							'call',
							'0x460103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
						],
						[
							'0',
							'42259045809535163221576417993425387648', // SDN
							'payload',
							'0xdc460103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f4502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300',
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, format as Format, 3, paraId, assetId, {
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
					const res = await bifrostTransferMultiasset(bifrostATA, 'submittable', 3, '0', 'ksm', {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
				it('Should correctly estimate the feeInfo for a transferMultiasset extrinsic', async () => {
					const res = await bifrostTransferMultiasset(bifrostATA, 'submittable', 3, '0', 'ksm', {
						weightLimit: {
							refTime: '1000',
							proofSize: '2000',
						},
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					const fees = await bifrostATA.fetchFeeInfo(res.tx, 'submittable');
					expect(fees?.partialFee.toString()).toEqual('171607466');
				});
			});
		});
	});
});
