// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { AssetTransferApi } from './AssetTransferApi.js';
import {
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	transferAssets,
	transferMultiasset,
	transferMultiassets,
	transferMultiassetWithFee,
} from './createXcmCalls/index.js';
import { XcmPalletName } from './createXcmCalls/util/establishXcmPallet.js';
import type { XTokensBaseArgs } from './createXcmCalls/xTokens/types.js';
import { Registry } from './registry/index.js';
import { adjustedMockBifrostParachainApi } from './testHelpers/adjustedMockBifrostParachainApi.js';
import { adjustedMockMoonriverParachainApi } from './testHelpers/adjustedMockMoonriverParachainApi.js';
import { adjustedMockMoonriverNoXTokensParachainApi } from './testHelpers/adjustedMockMoonriverParachainNoXTokens.js';
import { adjustedMockRelayApiNoLimitedReserveTransferAssets } from './testHelpers/adjustedMockRelayApiNoLimitedReserveTransferAssets.js';
import { adjustedMockRelayApi } from './testHelpers/adjustedMockRelayApiV9420.js';
import { adjustedMockSystemApi } from './testHelpers/adjustedMockSystemApiV1004000.js';
import { adjustedMockSystemApiV1016000 } from './testHelpers/adjustedMockSystemApiV1016000.js';
import { mockDryRunCallResult } from './testHelpers/mockDryRunCallResult.js';
import { mockSystemApi } from './testHelpers/mockSystemApi.js';
import { mockWeightInfo } from './testHelpers/mockWeightInfo.js';
import { AssetCallType, Direction, ResolvedCallInfo, UnsignedTransaction, XcmBaseArgs, XcmDirection } from './types.js';
import { AssetType } from './types.js';

const mockSubmittableExt = mockSystemApi.registry.createType(
	'Extrinsic',
	'0xfc041f0801010100411f0100010100c224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de160104000002043205040091010000000000',
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const systemAssetsApi = new AssetTransferApi(adjustedMockSystemApi, 'statemine', 2, { registryType: 'NPM' });
const relayAssetsApi = new AssetTransferApi(adjustedMockRelayApi, 'kusama', 2, { registryType: 'NPM' });
const relayAssetsApiNoLimitedReserveTransferAssets = new AssetTransferApi(
	adjustedMockRelayApiNoLimitedReserveTransferAssets,
	'kusama',
	2,
	{ registryType: 'NPM' },
);
const moonriverAssetsApi = new AssetTransferApi(adjustedMockMoonriverParachainApi, 'moonriver', 2, {
	registryType: 'NPM',
});
const bifrostAssetsApi = new AssetTransferApi(adjustedMockBifrostParachainApi, 'bifrost', 2, {
	registryType: 'NPM',
});
const moonriverAssetsNoXTokensApi = new AssetTransferApi(adjustedMockMoonriverNoXTokensParachainApi, 'moonriver', 2, {
	registryType: 'NPM',
});
const westmintAssetsApi = new AssetTransferApi(adjustedMockSystemApiV1016000, 'westmint', 4, {
	registryType: 'NPM',
});

describe('AssetTransferAPI', () => {
	describe('establishDirection', () => {
		it('Should correctly determine direction for SystemToSystem', () => {
			const info = {
				isOriginRelayChain: false,
				isOriginSystemParachain: true,
				isOriginParachain: false,
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isDestBridge: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToSystem');
		});
		it('Should correctly determine direction for SystemToPara', () => {
			const info = {
				isOriginRelayChain: false,
				isOriginSystemParachain: true,
				isOriginParachain: false,
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isDestBridge: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToPara');
		});
		it('Should correctly determine direction for SystemToRelay', () => {
			const info = {
				isOriginRelayChain: false,
				isOriginSystemParachain: true,
				isOriginParachain: false,
				isDestRelayChain: true,
				isDestSystemParachain: false,
				isDestParachain: false,
				isDestBridge: false,
			};
			const res = systemAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('SystemToRelay');
		});
		it('Should correctly determine direction for RelayToPara', () => {
			const info = {
				isOriginRelayChain: true,
				isOriginSystemParachain: false,
				isOriginParachain: false,
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isDestBridge: false,
			};
			const res = relayAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('RelayToPara');
		});
		it('Should correctly determine direction for RelayToSystem', () => {
			const info = {
				isOriginRelayChain: true,
				isOriginSystemParachain: false,
				isOriginParachain: false,
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isDestBridge: false,
			};
			const res = relayAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('RelayToSystem');
		});
		it('Should correctly determine direction for ParaToSystem', () => {
			const info = {
				isOriginSystemParachain: false,
				isOriginParachain: true,
				isOriginRelayChain: false,
				isDestRelayChain: false,
				isDestSystemParachain: true,
				isDestParachain: false,
				isDestBridge: false,
			};
			const res = moonriverAssetsApi['establishDirection'](false, info);
			expect(res).toEqual('ParaToSystem');
		});
		it('Should correctly determine direction for ParaToPara', () => {
			const info = {
				isOriginSystemParachain: false,
				isOriginParachain: true,
				isOriginRelayChain: false,
				isDestRelayChain: false,
				isDestSystemParachain: false,
				isDestParachain: true,
				isDestBridge: false,
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
			expect(res.format).toEqual('payload');
			expect(res.tx.toHex()).toEqual(
				'0xf81f0801010100411f0100010100c224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16010400000204320504009101000000000045022800010000e0510f00040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d4503',
			);
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

	describe('getXcmWeightToFee', () => {
		it('Should correctly return the xcm fee for a valid result', () => {
			const xcmWeightToFeeAssetResult = westmintAssetsApi.api.registry.createType('Result<u128, XcmPaymentApiError>', {
				ok: 100000000000,
			});

			expect(
				westmintAssetsApi['getXcmWeightToFee'](xcmWeightToFeeAssetResult, {
					V4: { parents: 1, interior: { Here: '' } },
				}),
			).toEqual({ xcmFee: '100000000000' });
		});
		it('Should correctly throw an error when given an error result', () => {
			const xcmWeightToFeeAssetResult = westmintAssetsApi.api.registry.createType('Result<u128, XcmPaymentApiError>', {
				err: 'AssetNotFound',
			});
			const assetLocation = { V4: { parents: 1, interior: { Here: '' } } };

			const err = () =>
				westmintAssetsApi['getXcmWeightToFee'](xcmWeightToFeeAssetResult, {
					V4: { parents: 1, interior: { Here: '' } },
				});
			expect(err).toThrow(`XcmFeeAsset Error: AssetNotFound - asset: ${JSON.stringify(assetLocation)}`);
		});
	});
	describe('dryRunCall', () => {
		const sendersAddress = '5HBuLJz9LdkUNseUEL6DLeVkx2bqEi6pQr8Ea7fS4bzx7i7E';

		it('Should correctly execute a dry run for a submittable extrinsic', async () => {
			const executionResult = await westmintAssetsApi.dryRunCall(sendersAddress, mockSubmittableExt, 'submittable');

			expect(executionResult?.asOk.executionResult.asOk.paysFee.toString()).toEqual(
				mockDryRunCallResult.Ok.executionResult.Ok.paysFee,
			);
		});

		it('Should correctly execute a dry run for a payload extrinsic', async () => {
			const payloadTexResult = await westmintAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				4,
				'transferAssets',
				'0',
				'asset-hub-westend',
				{ format: 'payload' },
			);

			const executionResult = await westmintAssetsApi.dryRunCall(sendersAddress, payloadTexResult.tx, 'payload');
			expect(executionResult?.asOk.executionResult.asOk.paysFee.toString()).toEqual(
				mockDryRunCallResult.Ok.executionResult.Ok.paysFee,
			);
		});

		it('Should correctly execute a dry run for a call', async () => {
			const callTxResult = await westmintAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				4,
				'transferAssets',
				'0',
				'asset-hub-westend',
				{
					format: 'call',
					dryRunCall: true,
					xcmFeeAsset: 'wnd',
					sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
				},
			);

			expect(callTxResult.localXcmFees![1]).toEqual({ xcmFee: '3500000000000000' });

			const executionResult = await westmintAssetsApi.dryRunCall(sendersAddress, callTxResult.tx, 'call');
			expect(executionResult?.asOk.executionResult.asOk.paysFee.toString()).toEqual(
				mockDryRunCallResult.Ok.executionResult.Ok.paysFee,
			);
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
						xcmPalletOverride: 'xTokens',
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
						xcmPalletOverride: 'xTokens',
					},
				);

				const decoded = moonriverAssetsApi.decodeExtrinsic(payloadTxResult.tx.toHex(), 'payload');
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
						xcmPalletOverride: 'xTokens',
					},
				);

				const decoded = moonriverAssetsApi.decodeExtrinsic(callTxResult.tx.toHex(), 'submittable');
				expect(decoded).toEqual(expected);
			});
		});
		describe('RelayToSystem', () => {
			it('Should decode a calls extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"120,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"xcmPallet"}';
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
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"250,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"xcmPallet"}';
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

				const decoded = relayAssetsApi.decodeExtrinsic(payloadTxResult.tx.toHex(), 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for RelayToSystem', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"0","interior":{"X1":{"Parachain":"1,000"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"0","interior":"Here"}},"fun":{"Fungible":"520,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"xcmPallet"}';
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
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"polkadotXcm"}';
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
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"20,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"polkadotXcm"}';
				const payloadTxResult = await systemAssetsApi.createTransferTransaction(
					'0',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['20000000000000'],
					{
						format: 'payload',
						keepAlive: true,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
						paysWithFeeOrigin: '1984',
					},
				);

				const decoded = systemAssetsApi.decodeExtrinsic(payloadTxResult.tx.toHex(), 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":"Here"}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":"Here"}},"fun":{"Fungible":"50,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedTeleportAssets","section":"polkadotXcm"}';
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

				const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx.toHex(), 'payload');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a foreign asset tx submittable extrinsic given its hash for SystemToPara', async () => {
				const expected =
					'{"args":{"dest":{"V2":{"parents":"1","interior":{"X1":{"Parachain":"2,023"}}}},"beneficiary":{"V2":{"parents":"0","interior":{"X1":{"AccountId32":{"network":"Any","id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}}}},"assets":{"V2":[{"id":{"Concrete":{"parents":"1","interior":{"X2":[{"Parachain":"2,125"},{"GeneralIndex":"0"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';

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
					'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,023"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"55"},{"GeneralIndex":"0"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":"Unlimited"},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';

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
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"11"}]}}},"fun":{"Fungible":"10,000,000,000,000"}}]},"fee_asset_item":"0","weight_limit":{"Limited":{"refTime":"1,000","proofSize":"1,000"}}},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['11'],
				['10000000000000'],
				{
					xcmVersion: 3,
					weightLimit: { refTime: '1000', proofSize: '1000' },
					format: 'call',
					keepAlive: true,
					paysWithFeeDest: 'usdt',
				},
			);

			const decoded = systemAssetsApi.decodeExtrinsic(callTxResult.tx, 'call');
			expect(decoded).toEqual(expected);
		});

		it('Should correctly set the feeAssetItem when paysWithFeeDest option is provided for a limitedReserveTransferAssets call', async () => {
			const expected =
				'{"args":{"dest":{"V3":{"parents":"1","interior":{"X1":{"Parachain":"2,000"}}}},"beneficiary":{"V3":{"parents":"0","interior":{"X1":{"AccountId32":{"network":null,"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"V3":[{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"10"}]}}},"fun":{"Fungible":"2,000"}},{"id":{"Concrete":{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"11"}]}}},"fun":{"Fungible":"100,000"}}]},"fee_asset_item":"1","weight_limit":"Unlimited"},"method":"limitedReserveTransferAssets","section":"polkadotXcm"}';
			const callTxResult = await systemAssetsApi.createTransferTransaction(
				'2000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['10', '11'],
				['2000', '100000'],
				{
					paysWithFeeDest: '11',
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
				['usdc'],
				['4000000000'],
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
		it('Should error during payload construction when a non integer paysWithFeeOrigin is provided that is not a valid MultiLocation', async () => {
			await expect(async () => {
				await systemAssetsApi.createTransferTransaction(
					'2023',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['usdc'],
					['4000000000'],
					{
						paysWithFeeOrigin: 'hello there',
						format: 'payload',
						keepAlive: true,
						paysWithFeeDest: 'USDC',
						xcmVersion: 3,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			}).rejects.toThrow('assetId "hello there" is not a valid paysWithFeeOrigin asset location');
		});

		it('Should error during payload construction when a paysWithFeeOrigin is provided that is not part of a valid lp token pair', async () => {
			await expect(async () => {
				await systemAssetsApi.createTransferTransaction(
					'2023',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					['1984'],
					['5000000'],
					{
						paysWithFeeOrigin:
							'{"parents":"1","interior":{"X2":[{"Parachain":"20070223"},{"PalletInstance":"1000000"}]}}',
						format: 'payload',
						keepAlive: true,
						paysWithFeeDest: '1984',
						xcmVersion: 3,
						sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
					},
				);
			}).rejects.toThrow(
				'assetId {"parents":"1","interior":{"X2":[{"Parachain":"20070223"},{"PalletInstance":"1000000"}]}} is not a valid liquidity pool token for statemine',
			);
		});
	});
	describe('resolveCall', () => {
		describe('SystemToPara', () => {
			it('Should correctly resolve to a `transferAssets` call for runtime with the `transferAssets` call', async () => {
				const specName = 'westmint';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: westmintAssetsApi.api,
					direction: Direction.SystemToPara as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '2023',
					xcmVersion: 4,
					specName: 'westmint',
					registry: registry,
				};

				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = ['transferAssets', await transferAssets(mockBaseArgs, mockBaseOpts)];

				const result = await westmintAssetsApi['resolveCall'](
					['usdt'],
					'polkadotXcm' as XcmPalletName,
					Direction.SystemToPara,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `limitedReserveTransferAssets` call', async () => {
				const specName = 'statemine';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: systemAssetsApi.api,
					direction: Direction.SystemToPara as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '2023',
					xcmVersion: 2,
					specName: 'statemine',
					registry: registry,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					['usdt'],
					'polkadotXcm' as XcmPalletName,
					Direction.SystemToPara,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `limitedReserveTransferAssets` call', async () => {
				const specName = 'statemine';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: systemAssetsApi.api,
					direction: Direction.SystemToPara as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '2023',
					xcmVersion: 2,
					specName: 'statemine',
					registry: registry,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					['usdt'],
					'polkadotXcm' as XcmPalletName,
					Direction.SystemToPara,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('SystemToRelay', () => {
			it('Should correctly resolve to a `limitedTeleportAssets` call', async () => {
				const specName = 'statemine';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: systemAssetsApi.api,
					direction: Direction.SystemToRelay as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['ksm'],
					amounts: ['10000000000'],
					destChainId: '0',
					xcmVersion: 2,
					specName: 'statemine',
					registry: registry,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedTeleportAssets',
					await limitedTeleportAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await systemAssetsApi['resolveCall'](
					['ksm'],
					'polkadotXcm' as XcmPalletName,
					Direction.SystemToRelay,
					'Teleport' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('SystemToSystem', () => {
			it('Should correctly resolve to a `limitedTeleportAssets` call', async () => {
				const specName = 'statemine';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: systemAssetsApi.api,
					direction: Direction.SystemToRelay as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['ksm'],
					amounts: ['10000000000'],
					destChainId: '1001',
					xcmVersion: 2,
					specName: 'statemine',
					registry: registry,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedTeleportAssets',
					await limitedTeleportAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await systemAssetsApi['resolveCall'](
					['ksm'],
					'polkadotXcm' as XcmPalletName,
					Direction.SystemToRelay,
					'Teleport' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('ParaToSystem', () => {
			it('Should correctly resolve to a `transferMultiAsset` call for a parachain runtime which includes the `xTokens` pallet', async () => {
				const specName = 'bifrost';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XTokensBaseArgs = {
					api: bifrostAssetsApi.api,
					direction: Direction.ParaToSystem as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '1000',
					xcmVersion: 2,
					specName: 'bifrost',
					registry: registry,
					xcmPallet: 'xTokens' as XcmPalletName,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = ['transferMultiasset', await transferMultiasset(mockBaseArgs, mockBaseOpts)];

				const result = await bifrostAssetsApi['resolveCall'](
					['usdt'],
					'xTokens' as XcmPalletName,
					Direction.ParaToSystem,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `transferMultiAssets` call for a parachain runtime which includes the `xTokens` pallet', async () => {
				const specName = 'moonriver';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XTokensBaseArgs = {
					api: moonriverAssetsApi.api,
					direction: Direction.ParaToSystem as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['ksm', 'usdt'],
					amounts: ['10000000000', '10000000000'],
					destChainId: '1000',
					xcmVersion: 2,
					specName: 'moonriver',
					registry: registry,
					xcmPallet: 'xTokens' as XcmPalletName,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'transferMultiassets',
					await transferMultiassets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					['ksm', 'usdt'],
					'xTokens' as XcmPalletName,
					Direction.ParaToSystem,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `transferMultiAssetWithFee` call for a parachain runtime which includes the `xTokens` pallet', async () => {
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const paysWithFeeDest =
					'{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}';

				const mockBaseArgs: XTokensBaseArgs = {
					api: moonriverAssetsApi.api,
					direction: Direction.ParaToSystem as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '1000',
					xcmVersion: 2,
					specName: 'moonriver',
					registry: registry,
					xcmPallet: 'xTokens' as XcmPalletName,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					paysWithFeeDest,
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'transferMultiassetWithFee',
					await transferMultiassetWithFee(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					['usdt'],
					'xTokens' as XcmPalletName,
					Direction.ParaToSystem,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
					paysWithFeeDest,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `limitedReserveTransferAssets` call for a parachain runtime which includes the `polkadotXcm` pallet and does not include the `xTokens` pallet', async () => {
				const specName = 'moonriver';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: moonriverAssetsNoXTokensApi.api,
					direction: Direction.ParaToSystem as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '1000',
					xcmVersion: 2,
					specName: 'moonriver',
					registry: registry,
				};
				const mockBaseOpts = {
					paysWithFeeDest: '1984',
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsNoXTokensApi['resolveCall'](
					['usdt'],
					'polkadotXcm' as XcmPalletName,
					Direction.ParaToSystem,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `limitedReserveTransferAssets` call for a parachain runtime which includes the `polkadotXcm` pallet and does not include the `xTokens` pallet', async () => {
				const specName = 'moonriver';
				const registry = new Registry(specName, {});

				const mockBaseArgs: XcmBaseArgs = {
					api: moonriverAssetsNoXTokensApi.api,
					direction: Direction.ParaToSystem as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: ['usdt'],
					amounts: ['10000000000'],
					destChainId: '1000',
					xcmVersion: 2,
					specName: 'moonriver',
					registry: registry,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					paysWithFeeDest: '1984',
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsNoXTokensApi['resolveCall'](
					['usdt'],
					'polkadotXcm' as XcmPalletName,
					Direction.ParaToSystem,
					'Reserve' as AssetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('ParaToRelay', () => {
			it('Should correctly resolve to `transferMultiasset` for a parachain runtime which includes the `xTokens` pallet', async () => {
				const specName = 'bifrost';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xTokens;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToRelay;
				const assetIds = ['ksm'];
				const mockBaseArgs: XTokensBaseArgs = {
					api: bifrostAssetsApi.api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '0',
					xcmVersion: 2,
					specName,
					registry: registry,
					xcmPallet,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					paysWithFeeDest: '1984',
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = ['transferMultiasset', await transferMultiasset(mockBaseArgs, mockBaseOpts)];

				const result = await bifrostAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to `limitedReserveTransferAssets` for a parachain runtime which includes the `polkadotXcm` pallet and does not include the `xTokens` pallet', async () => {
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.polkadotXcm;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToRelay;
				const assetIds = ['ksm'];

				const mockBaseArgs: XcmBaseArgs = {
					api: moonriverAssetsNoXTokensApi.api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '0',
					xcmVersion: 2,
					specName,
					registry: registry,
				};
				const mockBaseOpts = {
					paysWithFeeDest: '1984',
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsNoXTokensApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to `limitedReserveTransferAssets` for a parachain runtime which includes the `polkadotXcm` pallet and does not include the `xTokens` pallet', async () => {
				const api = moonriverAssetsNoXTokensApi.api;
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.polkadotXcm;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToRelay;
				const assetIds = ['ksm'];

				const mockBaseArgs: XcmBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '0',
					xcmVersion: 2,
					specName,
					registry: registry,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsNoXTokensApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('ParaToPara', () => {
			it('Should correctly resolve to `transferMultiasset` for parachain runtime which includes the `xTokens` pallet', async () => {
				const api = moonriverAssetsApi.api;
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xTokens;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToPara;
				const assetIds = ['movr'];

				const mockBaseArgs: XTokensBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '2001',
					xcmVersion: 2,
					specName,
					registry: registry,
					xcmPallet,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = ['transferMultiasset', await transferMultiasset(mockBaseArgs, mockBaseOpts)];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to `transferMultiassets` for parachain runtime which includes the `xTokens` pallet', async () => {
				const api = moonriverAssetsApi.api;
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xTokens;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToPara;
				const assetIds = ['vmovr', 'xcbnc'];

				const mockBaseArgs: XTokensBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000', '10000000000'],
					destChainId: '2001',
					xcmVersion: 2,
					specName,
					registry: registry,
					xcmPallet,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'transferMultiassets',
					await transferMultiassets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to `transferMultiassetWithFee` for parachain runtime which includes the `xTokens` pallet', async () => {
				const api = moonriverAssetsApi.api;
				const specName = 'moonriver';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xTokens;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.ParaToPara;
				const assetIds = ['vmovr', 'usdt'];
				const paysWithFeeDest =
					'{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":10}]}}';

				const mockBaseArgs: XTokensBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000', '10000000000'],
					destChainId: '2001',
					xcmVersion: 2,
					specName,
					registry: registry,
					xcmPallet,
				};
				const mockBaseOpts = {
					paysWithFeeDest,
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'transferMultiassetWithFee',
					await transferMultiassetWithFee(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
					paysWithFeeDest,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});
		describe('RelayToSystem', () => {
			it('Should correctly resolve to a `limitedTeleportAssets` call', async () => {
				const api = relayAssetsApi.api;
				const specName = 'kusama';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xcmPallet;
				const assetCallType = AssetCallType.Teleport;
				const direction = Direction.RelayToSystem;
				const assetIds = ['ksm'];

				const mockBaseArgs: XcmBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '1000',
					xcmVersion: 3,
					specName,
					registry: registry,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedTeleportAssets',
					await limitedTeleportAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		describe('RelayToPara', () => {
			it('Should correctly resolve to a `limitedReserveTransferAssets` call', async () => {
				const api = relayAssetsApi.api;
				const specName = 'kusama';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xcmPallet;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.RelayToSystem;
				const assetIds = ['ksm'];

				const mockBaseArgs: XcmBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '2001',
					xcmVersion: 3,
					specName,
					registry: registry,
				};
				const mockBaseOpts = {
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});

			it('Should correctly resolve to a `limitedReserveTransferAssets` call', async () => {
				const api = relayAssetsApi.api;
				const specName = 'kusama';
				const registry = new Registry(specName, {});
				const xcmPallet = XcmPalletName.xcmPallet;
				const assetCallType = AssetCallType.Reserve;
				const direction = Direction.RelayToSystem;
				const assetIds = ['ksm'];

				const mockBaseArgs: XcmBaseArgs = {
					api,
					direction,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds,
					amounts: ['10000000000'],
					destChainId: '2001',
					xcmVersion: 3,
					specName,
					registry: registry,
				};
				const mockBaseOpts = {
					weightLimit: {
						refTime: '3000',
						proofSize: '10000',
					},
					isLiquidTokenTransfer: false,
					isForeignAssetsTransfer: false,
				};

				const expected: ResolvedCallInfo = [
					'limitedReserveTransferAssets',
					await limitedReserveTransferAssets(mockBaseArgs, mockBaseOpts),
				];

				const result = await moonriverAssetsApi['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);

				expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
			});
		});

		it('Should correctly error when the resolved call is not found in the current runtime', async () => {
			const api = relayAssetsApiNoLimitedReserveTransferAssets.api;
			const specName = 'kusama';
			const registry = new Registry(specName, {});
			const xcmPallet = XcmPalletName.xcmPallet;
			const assetCallType = AssetCallType.Reserve;
			const direction = Direction.RelayToSystem;
			const assetIds = ['ksm'];

			const mockBaseArgs: XcmBaseArgs = {
				api,
				direction,
				destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				assetIds,
				amounts: ['10000000000'],
				destChainId: '1000',
				xcmVersion: 3,
				specName,
				registry: registry,
			};

			const mockBaseOpts = {
				weightLimit: {
					refTime: '3000',
					proofSize: '10000',
				},
				isLiquidTokenTransfer: false,
				isForeignAssetsTransfer: false,
			};

			await expect(async () => {
				await relayAssetsApiNoLimitedReserveTransferAssets['resolveCall'](
					assetIds,
					xcmPallet,
					direction,
					assetCallType,
					mockBaseArgs,
					mockBaseOpts,
				);
			}).rejects.toThrow('Did not find limitedReserveTransferAssets from pallet xcmPallet in the current runtime');
		});
	});
	describe('checkAssetLpTokenPairExists', () => {
		it('Should correctly return true when an assetConversion lp pool token location pair contains a match to a given paysWithFee asset location', async () => {
			const paysWithFeeOrigin = `{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`;

			expect(await systemAssetsApi['checkAssetLpTokenPairExists'](paysWithFeeOrigin)).toEqual([
				true,
				{
					Parents: '0',
					Interior: {
						X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
					},
				},
			]);
		});
		it('Should correctly return false when an assetConversion lp pool token location pair does not contain a match to a given paysWithFee asset location', async () => {
			const paysWithFeeOrigin = `{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"2000"}]}}`;

			expect(await systemAssetsApi['checkAssetLpTokenPairExists'](paysWithFeeOrigin)).toEqual([
				false,
				{
					Parents: '0',
					Interior: {
						X2: [{ PalletInstance: '50' }, { GeneralIndex: '2000' }],
					},
				},
			]);
		});
	});
	describe('checkContainsForeignAssets', () => {
		it('Should correctly return true when assetIds contain valid foreignAssets', async () => {
			const { api } = systemAssetsApi;
			const assetIds = [
				`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
			];

			const result = await systemAssetsApi['checkContainsForeignAssets'](api, assetIds);

			expect(result).toBe(true);
		});
		it('Should correctly return false when assetIds does not contain valid foreignAssets', async () => {
			const { api } = systemAssetsApi;
			const assetIds = [
				`{"parents":"0","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
			];

			const result = await systemAssetsApi['checkContainsForeignAssets'](api, assetIds);

			expect(result).toBe(false);
		});
	});
	describe('extToU8a', () => {
		it('Should correctly return a Uint8Array from an extrinsic for AssetHub', async () => {
			const assetHubCall =
				'0x1f0b04010100a90f0400010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063040401000013000064a7b3b6e00d0000000000';
			const ext = westmintAssetsApi.api.registry.createType('Extrinsic', { method: assetHubCall }, { version: 4 });
			const fakeSignerAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
			const u8a = await westmintAssetsApi['extToU8a'](westmintAssetsApi.api, ext, fakeSignerAddress);

			expect(u8a.toString()).toEqual(
				'165,2,132,0,212,53,147,199,21,253,211,28,97,20,26,189,4,169,159,214,130,44,133,88,133,76,205,227,154,86,132,231,165,109,162,125,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,69,2,40,0,0,0,31,11,4,1,1,0,169,15,4,0,1,1,0,196,219,123,203,115,62,17,124,11,52,172,150,53,75,16,212,126,132,160,6,185,231,230,106,34,157,23,78,143,242,160,99,4,4,1,0,0,19,0,0,100,167,179,182,224,13,0,0,0,0,0',
			);
		});
		it('Should correctly return a Uint8Array from an extrinsic for Bifrost', async () => {
			const bifrostCall =
				'0x46010100010200451f0608010a0013000064a7b3b6e00d01010200a10f0100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300';
			const ext = bifrostAssetsApi.api.registry.createType('Extrinsic', { method: bifrostCall }, { version: 4 });
			const fakeSignerAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
			const u8a = await bifrostAssetsApi['extToU8a'](bifrostAssetsApi.api, ext, fakeSignerAddress);

			expect(u8a.toString()).toEqual(
				'229,2,132,0,212,53,147,199,21,253,211,28,97,20,26,189,4,169,159,214,130,44,133,88,133,76,205,227,154,86,132,231,165,109,162,125,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,69,2,40,0,0,70,1,4,1,2,9,7,4,3,0,192,42,170,57,178,35,254,141,10,14,92,79,39,234,217,8,60,117,108,194,0,19,0,0,100,167,179,182,224,13,4,1,2,0,161,15,1,0,196,219,123,203,115,62,17,124,11,52,172,150,53,75,16,212,126,132,160,6,185,231,230,106,34,157,23,78,143,242,160,99,0',
			);
		});
		it('Should correctly return a Uint8Array from an extrinsic for Moonriver', async () => {
			const moonriverCall =
				'0x6a010100010200451f0608010a0013000064a7b3b6e00d01010200451f0100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300';
			const ext = moonriverAssetsApi.api.registry.createType('Extrinsic', { method: moonriverCall }, { version: 4 });
			const fakeSignerAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
			const u8a = await moonriverAssetsApi['extToU8a'](moonriverAssetsApi.api, ext, fakeSignerAddress);

			expect(u8a.toString()).toEqual(
				'105,2,132,53,71,114,119,118,97,69,70,53,122,88,98,50,54,70,122,57,114,99,81,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,69,2,40,0,106,1,1,0,1,2,0,69,31,6,8,1,10,0,19,0,0,100,167,179,182,224,13,1,1,2,0,69,31,1,0,196,219,123,203,115,62,17,124,11,52,172,150,53,75,16,212,126,132,160,6,185,231,230,106,34,157,23,78,143,242,160,99,0',
			);
		});
	});
});
