// Copyright 2024 Parity Technologies (UK) Ltd.

import { ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION } from '../../consts';
import { Registry } from '../../registry';
import { adjustedMockBifrostParachainApi } from '../../testHelpers/adjustedMockBifrostParachainApi';
import { adjustedmockHydrationParachainApi } from '../../testHelpers/adjustedMockHydrationParachainApi';
import { adjustedMockSystemApiV1016000 } from '../../testHelpers/adjustedMockSystemApiV1016000';
import { Direction, XcmBaseArgs, XcmDirection } from '../../types';
import { transferAssetsUsingTypeAndThen } from './transferAssetsUsingTypeAndThen';

describe('transferAssetsUsingTypeAndThen', () => {
	describe('SystemToBridge', () => {
		describe('XCM V3', () => {
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Paseo to Ethereum Sepolia', async () => {
				const registry = new Registry('asset-hub-paseo', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
					assetIds: [
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`, // Snowbridge Sepolia WETH location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
					xcmVersion: 3,
					specName: 'asset-hub-paseo',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest =
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}';
				const isForeignAssetsTransfer = true;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'RemoteReserve',
					remoteReserveAssetTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
					feesTransferType: 'RemoteReserve',
					remoteReserveFeesTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
				});

				expect(ext.toHex()).toBe(
					'0x1502041f0d03020109079edaa802030400020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b1400070010a5d4e80303010100a10f0300020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b140303010100a10f03040d010204000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b01a10f411f',
				);
			});
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Paseo to Ethereum Sepolia containing multiple assets', async () => {
				const registry = new Registry('asset-hub-paseo', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
					assetIds: [
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xc3d088842dcf02c13699f936bb83dfbbc6f721ab"}}]}}`,
					],
					amounts: ['1000000000000', '2000000000000'],
					destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
					xcmVersion: 3,
					specName: 'asset-hub-paseo',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest =
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}';
				const isForeignAssetsTransfer = true;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'RemoteReserve',
					remoteReserveAssetTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
					feesTransferType: 'RemoteReserve',
					remoteReserveFeesTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
				});

				expect(ext.toHex()).toBe(
					'0xb102041f0d03020109079edaa802030800020209079edaa8020300c3d088842dcf02c13699f936bb83dfbbc6f721ab000b00204aa9d10100020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b1400070010a5d4e80303010100a10f0300020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b140303010100a10f03040d010208000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b01a10f411f',
				);
			});
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Westend to Polkadot', async () => {
				const registry = new Registry('asset-hub-westend', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: [
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`, // location destChainId,
					xcmVersion: 3,
					specName: 'asset-hub-westend',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest = '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}';
				const isForeignAssetsTransfer = true;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'RemoteReserve',
					remoteReserveAssetTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
					feesTransferType: 'RemoteReserve',
					remoteReserveFeesTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
				});

				expect(ext.toHex()).toBe(
					'0x7101041f0d030202090200a10f0304000201090200070010a5d4e80303010100a10f0300020109020303010100a10f03040d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
				);
			});
			it('Should correctly set a custom XCM message to be executed on destination chain for V3', async () => {
				const registry = new Registry('asset-hub-westend', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: [
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`, // location destChainId,
					xcmVersion: 3,
					specName: 'asset-hub-westend',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest = '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}';
				const isForeignAssetsTransfer = true;
				const customXcmMessage = `[{"buyExecution":{"fees":{"id":{"concrete":{"parents":"1","interior":{"Here":""}}},"fun":{"fungible":"100000000000"}},"weightLimit":{"Unlimited":""}}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":{"parents":"0","interior":{"X1":{"AccountId32":{"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}}}]`;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'DestinationReserve',
					feesTransferType: 'DestinationReserve',
					customXcmOnDest: customXcmMessage,
				});

				expect(ext.toHex()).toBe(
					'0x7101041f0d030202090200a10f0304000201090200070010a5d4e80203000201090202030813000100000700e8764817000d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
				);
			});
		});

		describe('XCM V4', () => {
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Paseo to Ethereum Sepolia', async () => {
				const registry = new Registry('asset-hub-paseo', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
					assetIds: [
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`, // Snowbridge Sepolia WETH location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
					xcmVersion: 4,
					specName: 'asset-hub-paseo',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest =
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}';
				const isForeignAssetsTransfer = true;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'RemoteReserve',
					remoteReserveAssetTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
					feesTransferType: 'RemoteReserve',
					remoteReserveFeesTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
				});

				expect(ext.toHex()).toBe(
					'0x0d02041f0d04020109079edaa8020404020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b1400070010a5d4e80304010100a10f04020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b140304010100a10f04040d010204000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b01a10f411f',
				);
			});
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Westend to Polkadot', async () => {
				const registry = new Registry('asset-hub-westend', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: [
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`, // location destChainId,
					xcmVersion: 4,
					specName: 'asset-hub-westend',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest = '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}';
				const isForeignAssetsTransfer = true;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'RemoteReserve',
					remoteReserveAssetTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
					feesTransferType: 'RemoteReserve',
					remoteReserveFeesTransferTypeLocation: `{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}`,
				});

				expect(ext.toHex()).toBe(
					'0x6901041f0d040202090200a10f04040201090200070010a5d4e80304010100a10f04020109020304010100a10f04040d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
				);
			});
			it('Should correctly set a custom XCM message to be executed on destination chain for V4', async () => {
				const registry = new Registry('asset-hub-westend', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1016000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
					assetIds: [
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
					],
					amounts: ['1000000000000'],
					destChainId: `{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`, // location destChainId,
					xcmVersion: 4,
					specName: 'asset-hub-westend',
					registry,
				};
				const refTime = '1000';
				const proofSize = '2000';
				const paysWithFeeDest = '{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}';
				const isForeignAssetsTransfer = true;
				const customXcmMessage = `[{"buyExecution":{"fees":{"id":{"parents":"1","interior":{"Here":""}},"fun":{"fungible":"100000000000"}}},"weightLimit":{"Unlimited":""}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":{"parents":"0","interior":{"X1":[{"AccountId32":{"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}]}}}}]`;

				const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
					weightLimit: {
						refTime,
						proofSize,
					},
					paysWithFeeDest,
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'DestinationReserve',
					feesTransferType: 'DestinationReserve',
					customXcmOnDest: customXcmMessage,
				});

				expect(ext.toHex()).toBe(
					'0x6501041f0d040202090200a10f04040201090200070010a5d4e8020402010902020408130100000700e8764817000d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
				);
			});
		});
	});
	describe('ParaToEthereum', () => {
		it('Should correctly construct a transferAssetsUsingTypeAndThen tx from Hydration to Ethereum', async () => {
			const registry = new Registry('hydradx', {
				injectedRegistry: {
					polkadot: {
						2034: {
							tokens: [],
							assetsInfo: {},
							foreignAssetsInfo: {},
							poolPairsInfo: {},
							specName: 'hydradx',
							xcAssetsData: [
								{
									paraID: 0,
									symbol: 'WETH.snow',
									decimals: 18,
									xcmV1MultiLocation:
										'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
									asset: '1000189',
									assetHubReserveLocation: '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
								},
							],
						},
					},
				},
			});
			const isLiquidTokenTransfer = false;
			const isForeignAssetsTransfer = false;
			const baseArgs: XcmBaseArgs = {
				api: adjustedmockHydrationParachainApi,
				direction: Direction.ParaToEthereum as XcmDirection,
				destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				assetIds: ['DOT', 'WETH.snow'],
				amounts: ['1000000000000', '1000000000000'],
				destChainId: ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION,
				xcmVersion: 4,
				specName: 'hydradx',
				registry,
			};

			const ext = await transferAssetsUsingTypeAndThen(baseArgs, {
				paysWithFeeDest: 'DOT',
				sendersAddr: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
				isLiquidTokenTransfer,
				isForeignAssetsTransfer,
				assetTransferType: 'DestinationReserve',
				feesTransferType: 'DestinationReserve',
			});

			expect(ext.toHex()).toBe(
				'0x4904046b0d04010100a10f0408010000070010a5d4e802020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200070010a5d4e80204010002040c16040d010000010100d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d10010102020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20002010907040c1300010300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20004000d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b2c00000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000000000',
			);
		});
		it('Should correctly throw an error when a valid ERC20 token is not provided in assetIds', async () => {
			const registry = new Registry('bifrost_polkadot', {});
			const isLiquidTokenTransfer = false;
			const isForeignAssetsTransfer = false;
			const baseArgs: XcmBaseArgs = {
				api: adjustedMockBifrostParachainApi,
				direction: Direction.ParaToEthereum as XcmDirection,
				destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				assetIds: ['DOT', 'BNC'],
				amounts: ['1000000000000', '1000000000000'],
				destChainId: ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION, // location destChainId,
				xcmVersion: 4,
				specName: 'bifrost_polkadot',
				registry,
			};

			await expect(async () => {
				await transferAssetsUsingTypeAndThen(baseArgs, {
					paysWithFeeDest: 'DOT',
					sendersAddr: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
					isLiquidTokenTransfer,
					isForeignAssetsTransfer,
					assetTransferType: 'DestinationReserve',
					feesTransferType: 'DestinationReserve',
				});
			}).rejects.toThrow('A valid Snowbridge ERC20 token must provided for ParaToEthereum Direction.');
		});
	});
});
