// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { AssetsTransferApi } from './AssetsTransferApi';
import { adjustedMockRelayApi } from './testHelpers/adjustedMockRelayApi';
import { adjustedMockSystemApi } from './testHelpers/adjustedMockSystemApi';
import { adjustedMockWestmintApi } from './testHelpers/adjustedMockWestmintApi';
import { mockSystemApi } from './testHelpers/mockSystemApi';
import { mockWeightInfo } from './testHelpers/mockWeightInfo';
import { Direction } from './types';

const mockSubmittableExt = mockSystemApi.registry.createType(
	'Extrinsic',
	'0xfc041f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000'
) as SubmittableExtrinsic<'promise', ISubmittableResult>;

const systemAssetsApi = new AssetsTransferApi(adjustedMockSystemApi);
const relayAssetsApi = new AssetsTransferApi(adjustedMockRelayApi);
const westmintAssetsAPi = new AssetsTransferApi(adjustedMockWestmintApi);

describe('AssetTransferAPI', () => {
	describe('fetchChainInfo', () => {
		it('Should fetch the correct chain info', async () => {
			const { specName, specVersion } = await systemAssetsApi[
				'fetchChainInfo'
			]();
			expect(specName).toEqual('statemint');
			expect(specVersion).toEqual('9370');
		});
	});
	describe('establishDirection', () => {
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
		it('Should construct the correct call', () => {
			const res = systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'call'
			);
			expect(res).toEqual({
				direction: 'SystemToPara',
				format: 'call',
				method: 'limitedReserveTransferAssets',
				tx: '0x1f080100010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01010100a10f0104000002043205040091010000000000',
				xcmVersion: 2,
			});
		});
		it('Should construct the correct payload', () => {
			const res = systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				2,
				'limitedReserveTransferAssets',
				'payload'
			);
			expect(res).toEqual({
				direction: 'SystemToPara',
				format: 'payload',
				method: 'limitedReserveTransferAssets',
				tx: '0x15077b2263616c6c496e646578223a22307831663038222c2261726773223a7b2264657374223a7b227632223a7b22706172656e7473223a302c22696e746572696f72223a7b227831223a7b226163636f756e7449643332223a7b226e6574776f726b223a7b22616e79223a6e756c6c7d2c226964223a22307866356435373134633038346331313238343361636137346638633439386461303663633561326436333135336238323531383962616135313034336231663062227d7d7d7d7d2c2262656e6566696369617279223a7b227632223a7b22706172656e7473223a312c22696e746572696f72223a7b227831223a7b2270617261636861696e223a313030307d7d7d7d2c22617373657473223a7b227632223a5b7b226964223a7b22636f6e6372657465223a7b22706172656e7473223a302c22696e746572696f72223a7b227832223a5b7b2270616c6c6574496e7374616e6365223a35307d2c7b2267656e6572616c496e646578223a317d5d7d7d7d2c2266756e223a7b2266756e6769626c65223a3130307d7d5d7d2c226665655f61737365745f6974656d223a302c227765696768745f6c696d6974223a7b22756e6c696d69746564223a6e756c6c7d7d7d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				xcmVersion: 2,
			});
		});
		it('Should construct the correct submittable', () => {
			const res = systemAssetsApi['constructFormat'](
				mockSubmittableExt,
				Direction.SystemToPara,
				1,
				'limitedReserveTransferAssets',
				'submittable'
			);
			expect(res.tx.toRawType()).toEqual('Extrinsic');
		});
	});
	describe('fetchSafeXcmVersion', () => {
		it('Should return the correct value when the Option is true', async () => {
			const version = await systemAssetsApi['fetchSafeXcmVersion']();
			expect(version.toNumber()).toEqual(2);
		});
	});
	describe('fetchAssetType', () => {
		describe('SystemToRelay', () => {
			it('Should corectly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					'statemint',
					'0',
					['DOT'],
					Direction.SystemToRelay
				);

				expect(assetType).toEqual('Native');
			});
		});
		describe('RelayToSystem', () => {
			it('Should correctly return Native', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					'polkadot',
					'1000',
					['DOT'],
					Direction.RelayToSystem
				);

				expect(assetType).toEqual('Native');
			});
		});
		describe('SystemToPara', () => {
			it('Should correctly return Foreign', () => {
				const assetType = systemAssetsApi['fetchAssetType'](
					'statemint',
					'2000',
					['1'],
					Direction.SystemToPara
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
			const mockSystemAssetsApi = new AssetsTransferApi(adjustedMockSystemApi, {
				injectedRegistry,
			});

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
			const payloadFeeInfo = await systemAssetsApi.fetchFeeInfo(
				mockSubmittableExt,
				'payload'
			);
			expect((payloadFeeInfo?.weight as Weight).refTime.toString()).toEqual(
				mockWeightInfo.weight.refTime
			);
		});

		it('Should correctly fetch estimate for a call based xcm message', async () => {
			const callFeeInfo = await systemAssetsApi.fetchFeeInfo(
				mockSubmittableExt,
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
					'{"callIndex":"0x6301","args":{"dest":{"v2":{"parents":0,"interior":{"x1":{"parachain":1000}}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":0,"interior":{"here":null}}},"fun":{"fungible":1000000}}]},"fee_asset_item":0}}';
				const call = await relayAssetsApi.createTransferTransaction(
					'1000',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['1000000'],
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
					'{"callIndex":"0x6301","args":{"dest":{"v2":{"parents":0,"interior":{"x1":{"parachain":1000}}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":0,"interior":{"here":null}}},"fun":{"fungible":1000000}}]},"fee_asset_item":0}}';
				const payloadTxResult = await relayAssetsApi.createTransferTransaction(
					'1000',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['1000000'],
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
					'{"callIndex":"0x6301","args":{"dest":{"v2":{"parents":0,"interior":{"x1":{"parachain":1000}}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":0,"interior":{"here":null}}},"fun":{"fungible":1000000}}]},"fee_asset_item":0}}';
				const submittableTxResult =
					await relayAssetsApi.createTransferTransaction(
						'1000',
						'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						[],
						['1000000'],
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
					'{"callIndex":"0x1f01","args":{"dest":{"v2":{"parents":1,"interior":{"here":null}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":1,"interior":{"here":null}}},"fun":{"fungible":1000000}}]},"fee_asset_item":0}}';
				const call = await westmintAssetsAPi.createTransferTransaction(
					'0',
					'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					[],
					['1000000'],
					{
						format: 'call',
						keepAlive: true,
					}
				);

				const decoded = westmintAssetsAPi.decodeExtrinsic(call.tx, 'call');
				expect(decoded).toEqual(expected);
			});

			it('Should decode a payloads extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"callIndex":"0x1f01","args":{"dest":{"v2":{"parents":1,"interior":{"here":null}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":1,"interior":{"here":null}}},"fun":{"fungible":2000000}}]},"fee_asset_item":0}}';
				const payloadTxResult =
					await westmintAssetsAPi.createTransferTransaction(
						'0',
						'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						[],
						['2000000'],
						{
							format: 'payload',
							keepAlive: true,
						}
					);

				const decoded = westmintAssetsAPi.decodeExtrinsic(
					payloadTxResult.tx,
					'payload'
				);
				expect(decoded).toEqual(expected);
			});

			it('Should decode a submittables extrinsic given its hash for SystemToRelay', async () => {
				const expected =
					'{"callIndex":"0x1f01","args":{"dest":{"v2":{"parents":1,"interior":{"here":null}}},"beneficiary":{"v2":{"parents":0,"interior":{"x1":{"accountId32":{"network":{"any":null},"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}},"assets":{"v2":[{"id":{"concrete":{"parents":1,"interior":{"here":null}}},"fun":{"fungible":50000000}}]},"fee_asset_item":0}}';
				const submittableTxResult =
					await westmintAssetsAPi.createTransferTransaction(
						'0',
						'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
						[],
						['50000000'],
						{
							format: 'submittable',
							keepAlive: true,
						}
					);

				const decoded = westmintAssetsAPi.decodeExtrinsic(
					submittableTxResult.tx.toHex(),
					'submittable'
				);
				expect(decoded).toEqual(expected);
			});
		});
	});
});
