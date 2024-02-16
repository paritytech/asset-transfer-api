// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { AssetTransferApi } from './AssetTransferApi';
import { adjustedMockMoonriverParachainApi } from './testHelpers/adjustedMockMoonriverParachainApi';
import { adjustedMockRelayApi } from './testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from './testHelpers/adjustedMockSystemApiV1004000';
import { mockSystemApi } from './testHelpers/mockSystemApi';
import { mockWeightInfo } from './testHelpers/mockWeightInfo';
import { Direction, UnsignedTransaction } from './types';
import { AssetType } from './types';

const mockSubmittableExt = mockSystemApi.registry.createType(
	'Extrinsic',
	'0xfc041f0801010100411f0100010100c224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de160104000002043205040091010000000000',
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2, { registryType: 'NPM' });
const moonriverAssetsApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'moonriver', 2, {
	registryType: 'NPM',
});

describe('AssetTransferAPI', () => {
	describe('establishDirection', () => {
		it('Should correctly determine direction for SystemToSystem', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isOriginSystemParachain: true,
				isOriginParachain: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToSystem');
		});
		it('Should correctly determine direction for SystemToPara', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isOriginSystemParachain: true,
				isOriginParachain: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToPara');
		});
		it('Should correctly determine direction for SystemToRelay', () => {
			const info = {
				isDestRelayChain: true,
				isDestSystemParachain: false,
				isDestParachain: false,
				isOriginSystemParachain: true,
				isOriginParachain: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToRelay');
		});
		it('Should correctly determine direction for RelayToPara', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isOriginSystemParachain: false,
				isOriginParachain: false,
			};
			const res = relayAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('RelayToPara');
		});
		it('Should correctly determine direction for RelayToSystem', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isOriginSystemParachain: false,
				isOriginParachain: false,
			};
			const res = relayAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('RelayToSystem');
		});
		it('Should correctly determine direction for ParaToSystem', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isOriginSystemParachain: false,
				isOriginParachain: true,
			};
			const res = moonriverAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('ParaToSystem');
		});
		it('Should correctly determine direction for ParaToPara', () => {
			const info = {
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isOriginSystemParachain: false,
				isOriginParachain: true,
			};
			const res = moonriverAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('ParaToPara');
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
				{ format: 'call' },
			);
			expect(res).toEqual({
				dest: 'moonriver',
				origin: 'statemine',
				direction: 'SystemToPara',
				format: 'call',
				method: 'limitedReserveTransferAssets',
				tx: '0x1f0801010100411f0100010100c224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de160104000002043205040091010000000000',
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
				{ format: 'payload' },
			);
			expect(res).toEqual({
				dest: 'moonriver',
				origin: 'statemine',
				direction: 'SystemToPara',
				format: 'payload',
				method: 'limitedReserveTransferAssets',
				tx: '0xf81f0801010100411f0100010100c224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16010400000204320504009101000000000045022800010000cc240000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
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
				{ format: 'submittable' },
			);
			expect(res.tx.toRawType()).toEqual('Extrinsic');
		});
	});
	describe('fetchAssetType', () => {
		describe('SystemToRelay', () => {
			it('Should corectly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.SystemToRelay);

				expect(assetType).toEqual('Native');
			});
		});
		describe('SystemToSystem', () => {
			it('Should correctly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.SystemToSystem);

				expect(assetType).toEqual('Native');
			});

			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.SystemToSystem, true);

				expect(assetType).toEqual('Foreign');
			});
		});
		describe('RelayToSystem', () => {
			it('Should correctly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.RelayToSystem);

				expect(assetType).toEqual('Native');
			});
		});
		describe('SystemToPara', () => {
			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.SystemToPara);

				expect(assetType).toEqual('Foreign');
			});
		});
		describe('RelayToPara', () => {
			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](Direction.RelayToPara);

				expect(assetType).toEqual('Foreign');
			});
		});
	});

	describe('fetchCallType', () => {
		describe('RelayToSystem', () => {
			it('Should correctly return Teleport', () => {
				const assetCallType = relayAssetsApi['fetchCallType'](
					'0',
					'1000',
					['ksm'],
					Direction.RelayToSystem,
					AssetType.Native,
					false,
					false,
					relayAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
		});
		describe('RelayToPara', () => {
			it('Should correctly return Reserve', () => {
				const assetCallType = relayAssetsApi['fetchCallType'](
					'0',
					'2023',
					['ksm'],
					Direction.RelayToPara,
					AssetType.Native,
					false,
					false,
					relayAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
			});
		});
		describe('SystemToRelay', () => {
			it('Should correctly return Teleport', () => {
				const assetCallType = systemAssetsApi['fetchCallType'](
					'1000',
					'0',
					['ksm'],
					Direction.SystemToRelay,
					AssetType.Native,
					false,
					false,
					systemAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
		});
		describe('SystemToSystem', () => {
			it('Should correctly return Teleport when sending a native asset', () => {
				const assetCallType = systemAssetsApi['fetchCallType'](
					'1000',
					'1001',
					['ksm'],
					Direction.SystemToSystem,
					AssetType.Native,
					false,
					false,
					systemAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
			it('Should correctly throw an error when sending a foreign asset to a system chain', () => {
				const err = () =>
					systemAssetsApi['fetchCallType'](
						'1000',
						'1001',
						[`{"parents": "1", "interior": { "X1": {"Parachain": "2023"}}}`],
						Direction.SystemToSystem,
						AssetType.Foreign,
						true,
						false,
						systemAssetsApi.registry,
					);

				expect(err).toThrow('Unable to send foreign assets in direction SystemToSystem');
			});
		});
		describe('SystemToPara', () => {
			it('Should correctly return Teleport when sending to origin Parachain', () => {
				const assetCallType = systemAssetsApi['fetchCallType'](
					'1000',
					'2023',
					[`{"parents": "1", "interior": { "X1": {"Parachain": "2023"}}}`],
					Direction.SystemToPara,
					AssetType.Foreign,
					true,
					false,
					systemAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
		});
		describe('SystemToPara', () => {
			it('Should correctly return Reserve when sending to non origin Parachain', () => {
				const assetCallType = systemAssetsApi['fetchCallType'](
					'1000',
					'2125',
					[`{"parents": "1", "interior": { "X1": {"Parachain": "2023"}}}`],
					Direction.SystemToPara,
					AssetType.Foreign,
					true,
					false,
					systemAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
			});
		});
		describe('ParaToRelay', () => {
			it('Should correctly return Reserve', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'0',
					['ksm'],
					Direction.ParaToRelay,
					AssetType.Foreign,
					false,
					false,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
			});
		});
		describe('ParaToSystem', () => {
			it('Should correctly return Teleport when sending a foreign asset that is native to the origin', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'1000',
					[`{"parents": "1", "interior": { "X1": {"Parachain": "2023"}}}`],
					Direction.ParaToSystem,
					AssetType.Foreign,
					true,
					false,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
			it('Should correctly return Teleport when sending the parachains native asset', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'1000',
					['movr'],
					Direction.ParaToSystem,
					AssetType.Foreign,
					true,
					true,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Teleport');
			});
			it('Should correctly return Reserve when sending a foreign asset that is foreign to the origin', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'1000',
					[`{"parents": "1", "interior": { "X1": {"Parachain": "2125"}}}`],
					Direction.ParaToSystem,
					AssetType.Foreign,
					true,
					false,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
			});
		});
		describe('ParaToPara', () => {
			it('Should correctly return Reserve', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'2125',
					[`{"parents": "1", "interior": { "X1": {"Parachain": "2023"}}}`],
					Direction.ParaToPara,
					AssetType.Foreign,
					true,
					false,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
			});
		});
		describe('ParaToRelay', () => {
			it('Should correctly return Reserve', () => {
				const assetCallType = moonriverAssetsApi['fetchCallType'](
					'2023',
					'0',
					['KSM'],
					Direction.ParaToRelay,
					AssetType.Native,
					false,
					false,
					moonriverAssetsApi.registry,
				);

				expect(assetCallType).toEqual('Reserve');
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
						foreignAssetsInfo: {},
						specName: 'testing',
						poolPairsInfo: {},
					},
				},
			};
			const mockSystemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, {
				injectedRegistry,
				registryType: 'NPM',
			});

			expect(mockSystemAssetsApi.opts.injectedRegistry).toStrictEqual(injectedRegistry);
		});
	});

	describe('fetchFeeInfo', () => {
		it('Should correctly fetch estimate for submittable extrinsic xcm', async () => {
			const submittableFeeInfo = await systemAssetsApi.fetchFeeInfo(mockSubmittableExt, 'submittable');
			expect((submittableFeeInfo?.weight as Weight).refTime.toString()).toEqual(mockWeightInfo.weight.refTime);
		});

		it('Should correctly fetch estimate for a payload based xcm message', async () => {
			const payloadTexResult = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2000',
				'statemine',
				{ format: 'payload' },
			);

			const payloadFeeInfo = await systemAssetsApi.fetchFeeInfo(payloadTexResult.tx, 'payload');
			expect((payloadFeeInfo?.weight as Weight).refTime.toString()).toEqual(mockWeightInfo.weight.refTime);
		});

		it('Should correctly fetch estimate for a call based xcm message', async () => {
			const callTxResult = await systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'2000',
				'statmine',
				{ format: 'call' },
			);
			const callFeeInfo = await systemAssetsApi.fetchFeeInfo(callTxResult.tx, 'call');
			expect((callFeeInfo?.weight as Weight).refTime.toString()).toEqual(mockWeightInfo.weight.refTime);
		});
	});

	describe('decodeExtrinsic', () => {
		describe('ParaToPara', () => {
			it('Should decode a tx call extrinsic given its hash for ParaToPara', async () => {
				const expected =
					'{"args":{"asset":{"V2":{"id":{"Concrete":{"parents":"1","interior":{"X2":[{"Parachain":"2,001"},{"GeneralKey":"0x010a"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}},"dest":{"V2":{"parents":"1","interior":{"X2":[{"Parachain":"2,001"},{"AccountId32":{"network":"Any","id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}]}}},"dest_weight_limit":"Unlimited"},"method":"transferMultiasset","section":"xTokens"}';

				const callTxResult = await moonriverAssetsApi.createTransferTransaction(
					'2001',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['vMOVR'],
					['10000000000000'],
					{
						format: 'call',
						keepAlive: false,
					},
				);

				const decoded = moonriverAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a tx payload extrinsic given its hash for ParaToPara', async () => {
				const expected =
					'{"args":{"asset":{"V2":{"id":{"Concrete":{"parents":"1","interior":{"X2":[{"Parachain":"2,092"},{"GeneralKey":"0x000c"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}},"dest":{"V2":{"parents":"1","interior":{"X2":[{"Parachain":"2,092"},{"AccountId32":{"network":"Any","id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}]}}},"dest_weight_limit":"Unlimited"},"method":"transferMultiasset","section":"xTokens"}';

				const payloadTxResult = await moonriverAssetsApi.createTransferTransaction(
					'2092',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['KINT'],
					['10000000000000'],
					{
						xcmVersion: 2,
						format: 'payload',
						keepAlive: false,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				const decoded = moonriverAssetsApi.decodeExtrinsic(payloadTxResult.tx, 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a tx submittable extrinsic given its hash for ParaToPara', async () => {
				const expected =
					'{"args":{"asset":{"V2":{"id":{"Concrete":{"parents":"1","interior":{"X1":{"Parachain":"2,007"}}}},"fun":{"Fungible":"10,000,000,000,000"}}},"dest":{"V2":{"parents":"1","interior":{"X2":[{"Parachain":"2,007"},{"AccountId32":{"network":"Any","id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}]}}},"dest_weight_limit":"Unlimited"},"method":"transferMultiasset","section":"xTokens"}';

				const callTxResult = await moonriverAssetsApi.createTransferTransaction(
					'2007',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['SDN'],
					['10000000000000'],
					{
						format: 'submittable',
					},
				);

				const decoded = moonriverAssetsApi.decodeExtrinsic(callTxResult.tx.toHex(), 'submittable');
				expect(decoded).toEqual(expected);
			});
		});
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
					},
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
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				const decoded = relayAssetsApi.decodeExtrinsic(payloadTxResult.tx, 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"520,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"xcmPallet"}';
				const submittableTxResult = await relayAssetsApi.createTransferTransaction(
					'1000',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['520000000000000'],
					{
						format: 'submittable',
						keepAlive: true,
					},
				);

				const decoded = relayAssetsApi.decodeExtrinsic(submittableTxResult.tx.toHex(), 'submittable');
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
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
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
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(payloadTxResult.tx, 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"50,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"teleportAssets","section":"polkadotXcm"}';
				const submittableTxResult = await systemAssetsApi.createTransferTransaction(
					'0',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['50000000000000'],
					{
						format: 'submittable',
						keepAlive: true,
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(submittableTxResult.tx.toHex(), 'submittable');
				expect(decoded).toEqual(expected);
			});
		});

		describe('SystemToPara', () => {
			it('Should decode a foreign asset tx call extrinsic given its hash for SystemToPara', async () => {
				const expected =
					'{"args":{"id":{"parents":"1","interior":{"X2":[{"Parachain":"2,125"},{"GeneralIndex":"0"}]}},"target":{"Id":"5GTG3EQ159PpSh4kkF5TBrW6jkmc88HdYcsU8bsN83bndWh2"},"amount":"10,000,000,000,000"},"method":"transfer","section":"foreignAssets"}';

				const callTxResult = await systemAssetsApi.createTransferTransaction(
					'1000',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
					['10000000000000'],
					{
						format: 'call',
						keepAlive: false,
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a foreign asset tx payload extrinsic given its hash for SystemToPara', async () => {
				const expected =
					'{"args":{"id":{"parents":"1","interior":{"X2":[{"Parachain":"2,125"},{"GeneralIndex":"0"}]}},"target":{"Id":"5GTG3EQ159PpSh4kkF5TBrW6jkmc88HdYcsU8bsN83bndWh2"},"amount":"10,000,000,000,000"},"method":"transfer","section":"foreignAssets"}';

				const callTxResult = await systemAssetsApi.createTransferTransaction(
					'1000',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
					['10000000000000'],
					{
						format: 'payload',
						keepAlive: false,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a foreign asset tx submittable extrinsic given its hash for SystemToPara', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":{"X1":{"Parachain":"2,023"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":{"X3":[{"PalletInstance":"53"},{"Parachain":"2,125"},{"GeneralIndex":"0"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"reserveTransferAssets","section":"polkadotXcm"}';

				const callTxResult = await systemAssetsApi.createTransferTransaction(
					'2023',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
					['10000000000000'],
					{
						format: 'submittable',
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx.toHex(), 'submittable');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a liquid token tx call given its hash for SystemToPara', async () => {
				const expected =
					'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,023"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"55"},{"GeneralIndex":"0"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0"},"method":"reserveTransferAssets","section":"polkadotXcm"}';

				const callTxResult = await systemAssetsApi.createTransferTransaction(
					'2023',
					'GxshYjshWQkCLtCWwtW5os6tM3qvo6ozziDXG9KbqpHNVfZ',
					['0'],
					['10000000000000'],
					{
						format: 'call',
						xcmVersion: 3,
						transferLiquidToken: true,
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
				expect(decoded).toEqual(expected);
			});
		});
	});

	describe('feeAssetItem', () => {
		it('Should correctly set the feeAssetItem when paysWithFeeDest option is provided for a limitedReserveTransferAssets call', async () => {
			const expected =
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"30,000,000,000,000"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"11"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"1","weight_limit":{"Limited":{"refTime":"1,000","proofSize":"1,000"}}},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['ksm', '11'],
				['30000000000000', '10000000000000'],
				{
					xcmVersion: 3,
					weightLimit: { refTime: '1000', proofSize: '1000' },
					isLimited: true,
					format: 'call',
					keepAlive: true,
					paysWithFeeDest: 'usdt',
				},
			);

			const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
			expect(decoded).toEqual(expected);
		});

		it('Should correctly set the feeAssetItem when paysWithFeeDest option is provided for a reserveTransferAssets call', async () => {
			const expected =
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"100"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"10"}]}}},"fun":{"Fungible":"2,000"}}]},"fee_asset_item":"1"},"method":"reserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['ksm', '10'],
				['100', '2000'],
				{
					paysWithFeeDest: '10',
					xcmVersion: 3,
					format: 'call',
					keepAlive: true,
				},
			);

			const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
			expect(decoded).toEqual(expected);
		});
	});
	describe('paysWithFeeOrigin', () => {
		it('Should correctly assign the assedId field to an unsigned transaction when a valid paysWithFeeOrigin MultiLocation option is provided', async () => {
			const expected = { parents: '0', interior: { X2: [{ PalletInstance: '50' }, { GeneralIndex: '1,984' }] } };
			const payload = await systemAssetsApi.createTransferTransaction(
				'2023',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['1984', 'usdc'],
				['5000000', '4000000000'],
				{
					paysWithFeeOrigin:
						'{"parents": "0", "interior": {"X2": [{"PalletInstance": "50"},{"GeneralIndex": "1984"}]}}',
					format: 'payload',
					keepAlive: true,
					paysWithFeeDest: 'USDC',
					xcmVersion: 3,
					sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
				},
			);

			const result = mockSystemApi.registry.createType('ExtrinsicPayload', payload.tx, {
				version: 4,
			});
			const unsigned = result.toHuman() as unknown as UnsignedTransaction;

			expect(unsigned.assetId).toStrictEqual(expected);
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
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			}).rejects.toThrow('asset with assetId 100 is not a sufficient asset to pay for fees');
		});

		it('Should error during payload construction when a non integer paysWithFeeOrigin is provided that is not a valid MultiLocation', async () => {
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
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			}).rejects.toThrow('paysWithFeeOrigin value must be a valid MultiLocation. Received: hello there');
		});

		it('Should error during payload construction when a paysWithFeeOrigin is provided that is not part of a valid lp token pair', async () => {
			await expect(async () => {
				await systemAssetsApi.createTransferTransaction(
					'2023',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1984', 'usdc'],
					['5000000', '4000000000'],
					{
						paysWithFeeOrigin: '{"parents":"1","interior":{"X2":["Parachain":"2007","PalletInstance":"1000000"]}}',
						format: 'payload',
						keepAlive: true,
						paysWithFeeDest: 'USDC',
						xcmVersion: 3,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			}).rejects.toThrow(
				'paysWithFeeOrigin value must be a valid MultiLocation. Received: {"parents":"1","interior":{"X2":["Parachain":"2007","PalletInstance":"1000000"]}}',
			);
		});
	});
});
