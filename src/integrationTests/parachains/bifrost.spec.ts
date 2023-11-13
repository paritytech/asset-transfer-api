// Copyright 2023 Parity Technologies (UK) Ltd.

import { AssetTransferApi } from '../../AssetTransferApi';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi';
import type { Direction, Format } from '../../types';
import type { TestMultiasset, TestMultiassets, TestMultiassetWithFormat } from '../util';
import { paraTransferMultiasset as bifrostTransferMultiasset } from '../util';
import { paraTransferMultiassets as bifrostTransferMultiassets } from '../util';
import { paraTransferMultiassetWithFee as bifrostTransferMultiassetWithFee } from '../util';
import { paraTeleportNativeAsset as bifrsotTeleportNativeAsset } from '../util';

const bifrostATA = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 2);

describe('Bifrost', () => {
	describe('ParaToPara', () => {
		describe('transferMultiasset', () => {
			describe('XCM V2', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'bnc',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'limitedReserveTransferAssets',
								tx: '0x09012908010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000000000700e40b54020000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vbnc',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010200451f06080101000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'movr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xfc460101000102009d1f040a000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vmovr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010200451f0608010a000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'ksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xe8460101000100000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010200451f06080104000700e40b5402010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2092',
							'kint',
							{
								dest: 'kintsugi-parachain',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010200b1200608000c000700e40b540201010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2000',
							'kar',
							{
								dest: 'karura',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010200411f06080080000700e40b540201010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2004',
							'pha',
							{
								dest: 'khala',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xf446010100010100511f000700e40b540201010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
			});

			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'bnc',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'limitedReserveTransferAssets',
								tx: '0x09012908030101009d1f0300010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0304000000000700e40b54020000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2007',
							'sdn',
							{
								dest: 'shiden',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xf4460103000101005d1f000700e40b5402030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2023',
							'movr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xfc460103000102009d1f040a000700e40b5402030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2023',
							'ksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xe8460103000100000700e40b5402030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2004',
							'pha',
							{
								dest: 'khala',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xf446010300010100511f000700e40b540203010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x55014605010800010200451f0608010a000700e40b5402000102009d1f040a000700e40b540200000000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2092',
							['kint', 'kbtc'],
							['10000000000', '10000000000'],
							{
								dest: 'kintsugi-parachain',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x5d014605010800010200b1200608000b000700e40b540200010200b1200608000c000700e40b54020000000001010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2000',
							['kar', 'kusd'],
							['10000000000', '10000000000'],
							{
								dest: 'karura',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x5d014605010800010200411f06080080000700e40b540200010200411f06080081000700e40b54020000000001010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 2, paraId, assetIds, amounts, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x390146050308000100000700e40b5402000102009d1f040a000700e40b540200000000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2007',
							['ksm', 'sdn'],
							['10000000000', '10000000000'],
							{
								dest: 'shiden',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x310146050308000100000700e40b5402000101005d1f000700e40b540200000000030102005d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2004',
							['ksm', 'pha'],
							['10000000000', '10000000000'],
							{
								dest: 'khala',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x310146050308000100000700e40b540200010100511f000700e40b54020000000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 3, paraId, assetIds, amounts, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'limitedReserveTransferAssets',
								tx: '0x09012908010101009d1f0100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b0104000000000700e40b54020000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vbnc',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010200451f06080101000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'movr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3501460301000102009d1f040a000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vmovr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010200451f0608010a000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'ksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2101460301000100000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2023',
							'vksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010200451f06080104000700e40b54020100010300a10f043205011f0000010102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2092',
							'kint',
							{
								dest: 'kintsugi-parachain',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010200b1200608000c000700e40b54020100010300a10f043205011f000001010200b1200100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2000',
							'kar',
							{
								dest: 'karura',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010200411f06080080000700e40b54020100010300a10f043205011f000001010200411f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'2004',
							'pha',
							{
								dest: 'khala',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2d0146030100010100511f000700e40b54020100010300a10f043205011f000001010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'2023',
							'movr',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3501460303000102009d1f040a000700e40b54020300010300a10f043205011f0000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2023',
							'ksm',
							{
								dest: 'moonriver',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2101460303000100000700e40b54020300010300a10f043205011f0000030102009d1f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'2004',
							'pha',
							{
								dest: 'khala',
								origin: 'bifrost',
								direction: 'ParaToPara' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2d0146030300010100511f000700e40b54020300010300a10f043205011f000003010200511f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xe8460101000100000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'rmrk',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010100010300a10f04320520000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'usdt',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x090146010100010300a10f043205011f000700e40b540201010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiasset txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xe8460103000100000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'rmrk',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x050146010300010300a10f04320520000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'usdt',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0x090146010300010300a10f043205011f000700e40b540203010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, 'payload', 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x410146050108000100000700e40b540200010300a10f04320520000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							['rmrk', 'usdt'],
							['10000000000', '10000000000'],
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x61014605010800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							['ksm', 'usdt'],
							['10000000000', '10000000000'],
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x450146050108000100000700e40b540200010300a10f043205011f000700e40b54020000000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 2, paraId, assetIds, amounts, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x410146050308000100000700e40b540200010300a10f04320520000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							['rmrk', 'usdt'],
							['10000000000', '10000000000'],
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x61014605030800010300a10f04320520000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							['ksm', 'usdt'],
							['10000000000', '10000000000'],
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassets',
								tx: '0x450146050308000100000700e40b540200010300a10f043205011f000700e40b54020000000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetIds, amounts, expectedResult] = test;
						const res = await bifrostTransferMultiassets(bifrostATA, 'payload', 3, paraId, assetIds, amounts, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
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
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2101460301000100000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'rmrk',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030100010300a10f04320520000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'usdt',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x410146030100010300a10f043205011f000700e40b54020100010300a10f043205011f000001010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
			});
			describe('XCM V3', () => {
				it('Should correctly build xTokens transferMultiassetWithFee txs from Bifrost Kusama', async () => {
					const tests: TestMultiasset[] = [
						[
							'1000',
							'ksm',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x2101460303000100000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'rmrk',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x3d0146030300010300a10f04320520000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'usdt',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'transferMultiassetWithFee',
								tx: '0x410146030300010300a10f043205011f000700e40b54020300010300a10f043205011f000003010200a10f0100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, expectedResult] = test;
						const res = await bifrostTransferMultiassetWithFee(bifrostATA, 'payload', 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
			});
		});
		describe('limitedTeleportAssets', () => {
			describe('XCM V2', () => {
				it('Should correctly construct a limitedTeleportAssets call when sending Bifrosts primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'BNC',
							'call',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'call',
								method: 'limitedTeleportAssets',
								tx: '0x290901010100a10f01000101007369626c270800000000000000000000000000000000000000000000000000000104000000000700e40b54020000000001a10f411f',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'BNC',
							'payload',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'limitedTeleportAssets',
								tx: '0x0901290901010100a10f01000101007369626c270800000000000000000000000000000000000000000000000000000104000000000700e40b54020000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await bifrsotTeleportNativeAsset(bifrostATA, format as Format, assetId, 2, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V2 limitedTeleportAssets submittable containing the native parachain asset', async () => {
					const res = await bifrsotTeleportNativeAsset(bifrostATA, 'submittable', 'BNC', 2, {
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
				it('Should correctly construct a limitedTeleportAssets call when sending Bifrosts primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'BNC',
							'call',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'call',
								method: 'limitedTeleportAssets',
								tx: '0x290903010100a10f03000101007369626c270800000000000000000000000000000000000000000000000000000304000000000700e40b54020000000001a10f411f',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'BNC',
							'payload',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'limitedTeleportAssets',
								tx: '0x0901290903010100a10f03000101007369626c270800000000000000000000000000000000000000000000000000000304000000000700e40b54020000000001a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await bifrsotTeleportNativeAsset(bifrostATA, format as Format, assetId, 3, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V3 limitedTeleportAssets submittable containing the native parachain asset', async () => {
					const res = await bifrsotTeleportNativeAsset(bifrostATA, 'submittable', 'BNC', 3, {
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
				it('Should correctly construct a teleportAssets call when sending Bifrosts primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'BNC',
							'call',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'call',
								method: 'teleportAssets',
								tx: '0x290101010100a10f01000101007369626c270800000000000000000000000000000000000000000000000000000104000000000700e40b540200000000',
								xcmVersion: 2,
							},
						],
						[
							'1000',
							'BNC',
							'payload',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'teleportAssets',
								tx: '0xf4290101010100a10f01000101007369626c270800000000000000000000000000000000000000000000000000000104000000000700e40b54020000000045022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await bifrsotTeleportNativeAsset(bifrostATA, format as Format, assetId, 2, {
							isLimited: false,
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V2 teleportAssets submittable containing the native parachain asset', async () => {
					const res = await bifrsotTeleportNativeAsset(bifrostATA, 'submittable', 'BNC', 2, {
						isLimited: false,
						isForeignAssetsTransfer: false,
						isLiquidTokenTransfer: false,
					});
					expect(res.tx.toRawType()).toEqual('Extrinsic');
				});
			});
			describe('XCM V3', () => {
				it('Should correctly construct a teleportAssets call when sending Bifrosts primary native asset', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'1000',
							'BNC',
							'call',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'call',
								method: 'teleportAssets',
								tx: '0x290103010100a10f03000101007369626c270800000000000000000000000000000000000000000000000000000304000000000700e40b540200000000',
								xcmVersion: 3,
							},
						],
						[
							'1000',
							'BNC',
							'payload',
							{
								dest: 'statemine',
								origin: 'bifrost',
								direction: 'ParaToSystem' as Direction,
								format: 'payload',
								method: 'teleportAssets',
								tx: '0xf4290103010100a10f03000101007369626c270800000000000000000000000000000000000000000000000000000304000000000700e40b54020000000045022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [, assetId, format, expectedResult] = test;
						const res = await bifrsotTeleportNativeAsset(bifrostATA, format as Format, assetId, 3, {
							isLimited: false,
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V3 teleportAssets submittable containing the native parachain asset', async () => {
					const res = await bifrsotTeleportNativeAsset(bifrostATA, 'submittable', 'BNC', 3, {
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
				it('Should correctly build xTokens transferMultiasset txs from Bifrost', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'xcKSM',
							'call',
							{
								dest: 'kusama',
								origin: 'bifrost',
								direction: 'ParaToRelay' as Direction,
								format: 'call',
								method: 'transferMultiasset',
								tx: '0x460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
								xcmVersion: 2,
							},
						],
						[
							'0',
							'42259045809535163221576417993425387648',
							'call',
							{
								dest: 'kusama',
								origin: 'bifrost',
								direction: 'ParaToRelay' as Direction,
								format: 'call',
								method: 'transferMultiasset',
								tx: '0x460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
								xcmVersion: 2,
							},
						],
						[
							'0',
							'ksm',
							'payload',
							{
								dest: 'kusama',
								origin: 'bifrost',
								direction: 'ParaToRelay' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xdc460101000100000700e40b54020101010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 2,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, format as Format, 2, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V2 submittable transferMultiasset', async () => {
					const res = await bifrostTransferMultiasset(bifrostATA, 'submittable', 2, '0', 'ksm', {
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
				it('Should correctly build xTokens transferMultiasset txs from Bifrost', async () => {
					const tests: TestMultiassetWithFormat[] = [
						[
							'0',
							'ksm',
							'call',
							{
								dest: 'kusama',
								origin: 'bifrost',
								direction: 'ParaToRelay' as Direction,
								format: 'call',
								method: 'transferMultiasset',
								tx: '0x460103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
								xcmVersion: 3,
							},
						],
						[
							'0',
							'42259045809535163221576417993425387648', // SDN
							'payload',
							{
								dest: 'kusama',
								origin: 'bifrost',
								direction: 'ParaToRelay' as Direction,
								format: 'payload',
								method: 'transferMultiasset',
								tx: '0xdc460103000100000700e40b54020301010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f45022800fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
								xcmVersion: 3,
							},
						],
					];

					for (const test of tests) {
						const [paraId, assetId, format, expectedResult] = test;
						const res = await bifrostTransferMultiasset(bifrostATA, format as Format, 3, paraId, assetId, {
							isLimited: true,
							weightLimit: {
								refTime: '1000',
								proofSize: '2000',
							},
							isForeignAssetsTransfer: false,
							isLiquidTokenTransfer: false,
						});

						expect(res).toEqual(expectedResult);
					}
				});
				it('Should correctly build a V3 submittable transferMultiasset', async () => {
					const res = await bifrostTransferMultiasset(bifrostATA, 'submittable', 3, '0', 'ksm', {
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
