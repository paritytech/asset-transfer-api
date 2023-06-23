// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { AssetsTransferApi } from './AssetsTransferApi';
import { adjustedMockRelayApi } from './testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from './testHelpers/adjustedMockSystemApi';
import { mockSystemApi } from './testHelpers/mockSystemApi';
import { mockWeightInfo } from './testHelpers/mockWeightInfo';
import { Direction, UnsignedTransaction } from './types';

const mockSubmittableExt = mockSystemApi.registry.createType(
	'Extrinsic',
	'0xfc041f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000'
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const systemAssetsApi = new AssetsTransferApi(
	adjustedMockSystemApi,
	'statemine',
	2
);
const relayAssetsApi = new AssetsTransferApi(adjustedMockRelayApi, 'kusama', 2);

describe('AssetTransferAPI', () => {
	describe('establishDirection', () => {
		it('Should correctly determine direction for SystemToSystem', () => {
			const res = relayAssetsApi['establishDirection']('1000', 'statemint');
			expect(res).toEqual('SystemToSystem');
		});
		it('Should correctly determine direction for SystemToPara', () => {
			const res = systemAssetsApi['establishDirection']('2000', 'statemint');
			expect(res).toEqual('SystemToPara');
		});
		it('Should correctly determine direction for SystemToRelay', () => {
			const res = systemAssetsApi['establishDirection']('0', 'statemint');
			expect(res).toEqual('SystemToRelay');
		});
		it('Should correctly determine direction for RelayToPara', () => {
			const res = relayAssetsApi['establishDirection']('2000', 'polkadot');
			expect(res).toEqual('RelayToPara');
		});
		it('Should correctly determine direction for RelayToSystem', () => {
			const res = relayAssetsApi['establishDirection']('1000', 'polkadot');
			expect(res).toEqual('RelayToSystem');
		});
	});
	describe('constructFormat', () => {
		it('Should construct the correct call', async () => {
			const res = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2023',
				'statemine',
				'call'
			);
			expect(res).toEqual({
				dest: 'moonriver',
				origin: 'statemine',
				direction: 'SystemToPara',
				format: 'call',
				method: 'limitedReserveTransferAssets',
				tx: '0x1f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000',
				xcmVersion: 2,
			});
		});
		it('Should construct the correct payload', async () => {
			const res = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2023',
				'statemine',
				'payload'
			);
			expect(res).toEqual({
				dest: 'moonriver',
				origin: 'statemine',
				direction: 'SystemToPara',
				format: 'payload',
				method: 'limitedReserveTransferAssets',
				tx: '0xf81f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000450228000100000000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
				xcmVersion: 2,
			});
		});
		it('Should construct the correct submittable', async () => {
			const res = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				1,
				'limitedReserveTransferAssets',
				'2023',
				'Statmine',
				'submittable'
			);
			expect(res.tx.toRawType()).toEqual('Extrinsic');
		});
	});
	describe('fetchAssetType', () => {
		describe('SystemToRelay', () => {
			it('Should corectly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					Direction.SystemToRelay
				);

				expect(assetType).toEqual('Native');
			});
		});
		describe('RelayToSystem', () => {
			it('Should correctly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					Direction.RelayToSystem
				);

				expect(assetType).toEqual('Native');
			});
		});
		describe('SystemToPara', () => {
			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					Direction.SystemToPara
				);

				expect(assetType).toEqual('Foreign');
			});
		});
		describe('RelayToPara', () => {
			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					Direction.RelayToPara
				);

				expect(assetType).toEqual('Foreign');
			});
		});
	});
	describe('Opts', () => {
		it('Should correctly read in the injectedRegistry option', () => {
			const injectedRegistry = {
				polkadot: {
					'9876': {
						tokens: ['TST'],
						assetsInfo: {},
						specName: 'testing',
					},
				},
			};
			const mockSystemAssetsApi = new AssetsTransferApi(
				adjustedMockSystemApi,
				'statemine',
				2,
				{
					injectedRegistry,
				}
			);

			expect(mockSystemAssetsApi._opts.injectedRegistry).toStrictEqual(
				injectedRegistry
			);
		});
	});

	describe('fetchFeeInfo', () => {
		it('Should correctly fetch estimate for submittable extrinsic xcm', async () => {
			const submittableFeeInfo = await systemAssetsApi.fetchFeeInfo(
				mockSubmittableExt,
				'submittable'
			);
			expect((submittableFeeInfo?.weight as Weight).refTime.toString()).toEqual(
				mockWeightInfo.weight.refTime
			);
		});

		it('Should correctly fetch estimate for a payload based xcm message', async () => {
			const payloadTexResult = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2000',
				'statmine',
				'payload'
			);

			const payloadFeeInfo = await systemAssetsApi.fetchFeeInfo(
				payloadTexResult.tx,
				'payload'
			);
			expect((payloadFeeInfo?.weight as Weight).refTime.toString()).toEqual(
				mockWeightInfo.weight.refTime
			);
		});

		it('Should correctly fetch estimate for a call based xcm message', async () => {
			const callTxResult = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2000',
				'statmine',
				'call'
			);
			const callFeeInfo = await systemAssetsApi.fetchFeeInfo(
				callTxResult.tx,
				'call'
			);
			expect((callFeeInfo?.weight as Weight).refTime.toString()).toEqual(
				mockWeightInfo.weight.refTime
			);
		});
	});

	describe('decodeExtrinsic', () => {
		describe('RelayToSystem', () => {
			it('Should decode a calls extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"120,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"xcmPallet"}';
				const call = await relayAssetsApi.createTransferTransaction(
					'1000',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['120000000000000'],
					{
						format: 'call',
						keepAlive: true,
					}
				);

				const decoded = relayAssetsApi.decodeExtrinsic(call.tx, 'call');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a payloads extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"250,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"xcmPallet"}';
				const payloadTxResult = await relayAssetsApi.createTransferTransaction(
					'1000',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['250000000000000'],
					{
						format: 'payload',
						keepAlive: true,
					}
				);

				const decoded = relayAssetsApi.decodeExtrinsic(
					payloadTxResult.tx,
					'payload'
				);
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"520,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"xcmPallet"}';
				const submittableTxResult =
					await relayAssetsApi.createTransferTransaction(
						'1000',
						'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						[],
						['520000000000000'],
						{
							format: 'submittable',
							keepAlive: true,
						}
					);

				const decoded = relayAssetsApi.decodeExtrinsic(
					submittableTxResult.tx.toHex(),
					'submittable'
				);
				expect(decoded).toEqual(expected);
			});
		});

		describe('SystemToRelay', () => {
			it('Should decode a calls extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"polkadotXcm"}';
				const callTxResult = await systemAssetsApi.createTransferTransaction(
					'0',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['10000000000000'],
					{
						format: 'call',
						keepAlive: true,
					}
				);

				const decoded = systemAssetsApi.decodeExtrinsic(
					callTxResult.tx,
					'call'
				);
				expect(decoded).toEqual(expected);
			});

			it('Should decode a payloads extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"20,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"polkadotXcm"}';
				const payloadTxResult = await systemAssetsApi.createTransferTransaction(
					'0',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['20000000000000'],
					{
						format: 'payload',
						keepAlive: true,
					}
				);

				const decoded = systemAssetsApi.decodeExtrinsic(
					payloadTxResult.tx,
					'payload'
				);
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"50,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"polkadotXcm"}';
				const submittableTxResult =
					await systemAssetsApi.createTransferTransaction(
						'0',
						'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						[],
						['50000000000000'],
						{
							format: 'submittable',
							keepAlive: true,
						}
					);

				const decoded = systemAssetsApi.decodeExtrinsic(
					submittableTxResult.tx.toHex(),
					'submittable'
				);
				expect(decoded).toEqual(expected);
			});
		});
	});

	describe('feeAssetItem', () => {
		it('Should correctly set the feeAssetItem when paysWithFeeDest option is provided for a limitedReserveTransferAssets call', async () => {
			const expected =
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"10"}]}}},"fun":{"Fungible":"10,000,000,000,000"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"11"}]}}},"fun":{"Fungible":"20,000,000,000,000"}},{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"30,000,000,000,000"}}]},"fee_asset_item":"1","weight_limit":{"Limited":{"refTime":"0","proofSize":"0"}}},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['ksm', '10', '11'],
				['30000000000000', '10000000000000', '20000000000000'],
				{
					xcmVersion: 3,
					weightLimit: '100000',
					isLimited: true,
					format: 'call',
					keepAlive: true,
					paysWithFeeDest: 'usdt',
				}
			);

			const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
			expect(decoded).toEqual(expected);
		});

		it('Should correctly set the feeAssetItem when paysWithFeeDest option is provided for a reserveTransferAssets call', async () => {
			const expected =
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"10"}]}}},"fun":{"Fungible":"2,000"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"11"}]}}},"fun":{"Fungible":"500"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"12"}]}}},"fun":{"Fungible":"700"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"34"}]}}},"fun":{"Fungible":"300"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"36"}]}}},"fun":{"Fungible":"400"}},{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"100"}}]},"fee_asset_item":"0"},"method":"reserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['ksm', '10', '34', '36', '11', '12'],
				['100', '2000', '300', '400', '500', '700'],
				{
					paysWithFeeDest: '10',
					xcmVersion: 3,
					format: 'call',
					keepAlive: true,
				}
			);

			const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
			expect(decoded).toEqual(expected);
		});
	});
	describe('paysWithFeeOrigin', () => {
		it('Should correctly assign the assedId field to an unsigned transaction when a valid sufficient paysWithFeeOrigin option is provided', async () => {
			const expected = '1,984';
			const payload = await systemAssetsApi.createTransferTransaction(
				'2023',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1984', 'usdc'],
				['5000000', '4000000000'],
				{
					paysWithFeeOrigin: '1984',
					format: 'payload',
					keepAlive: true,
					paysWithFeeDest: 'USDC',
					xcmVersion: 3,
				}
			);

			const result = mockSystemApi.registry.createType(
				'ExtrinsicPayload',
				payload.tx,
				{
					version: 4,
				}
			);
			const unsigned = result.toHuman() as unknown as UnsignedTransaction;

			expect(unsigned.assetId).toEqual(expected);
		});

		it('Should error during payload construction when a paysWithFeeOrigin is provided that is not a number', async () => {
			await expect(async () => {
				await systemAssetsApi.createTransferTransaction(
					'2023',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1984', 'usdc'],
					['5000000', '4000000000'],
					{
						paysWithFeeOrigin: 'hello there',
						format: 'payload',
						keepAlive: true,
						paysWithFeeDest: 'USDC',
						xcmVersion: 3,
					}
				);
			}).rejects.toThrowError(
				'paysWithFeeOrigin value must be a valid number. Received: hello there'
			);
		});

		it('Should error during payload construction when a paysWithFeeOrigin is provided that matches a non sufficient asset', async () => {
			await expect(async () => {
				await systemAssetsApi.createTransferTransaction(
					'2023',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1984', 'usdc'],
					['5000000', '4000000000'],
					{
						paysWithFeeOrigin: '100',
						format: 'payload',
						keepAlive: true,
						paysWithFeeDest: 'USDC',
						xcmVersion: 3,
					}
				);
			}).rejects.toThrowError(
				'asset with assetId 100 is not a sufficient asset to pay for fees'
			);
		});
	});
});
