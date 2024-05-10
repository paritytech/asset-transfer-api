// Copyright 2024 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { adjustedMockSystemApiV1011000 } from '../../testHelpers/adjustedMockSystemApiV1011000';
import { Direction, XcmBaseArgs, XcmDirection } from '../../types';
import { transferAssetsUsingTypeAndThen } from './transferAssetsUsingTypeAndThen';

describe('transferAssetsUsingTypeAndThen', () => {
	describe('SystemToBridge', () => {
		describe('XCM V3', () => {
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Rococo to Ethereum Sepolia', async () => {
			    const registry = new Registry('asset-hub-rococo', {});
			    const isLiquidTokenTransfer = false;
			    const baseArgs: XcmBaseArgs = {
			        api: adjustedMockSystemApiV1011000,
			        direction: Direction.SystemToBridge as XcmDirection,
			        destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
			        assetIds: [
			            `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`, // Snowbridge Sepolia WETH location
			        ],
			        amounts: ['1000000000000'],
			        destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
			        xcmVersion: 3,
			        specName: 'asset-hub-rococo',
			        registry,
			    };
			    const refTime = '1000';
			    const proofSize = '2000';
			    const paysWithFeeDest = '{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}';
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
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Rococo to Ethereum Sepolia containing multiple assets', async () => {
				const registry = new Registry('asset-hub-rococo', {});
				const isLiquidTokenTransfer = false;
				const baseArgs: XcmBaseArgs = {
					api: adjustedMockSystemApiV1011000,
					direction: Direction.SystemToBridge as XcmDirection,
					destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
					assetIds: [
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
						`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xc3d088842dcf02c13699f936bb83dfbbc6f721ab"}}]}}`,
					],
					amounts: ['1000000000000', '2000000000000'],
					destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
					xcmVersion: 3,
					specName: 'asset-hub-rococo',
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
					'0xb102041f0d03020109079edaa802030800020209079edaa8020300c3d088842dcf02c13699f936bb83dfbbc6f721ab000b00204aa9d10100020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b1400070010a5d4e80303010100a10f0300020209079edaa8020300fff9976782d46cc05630d1f6ebab18b2324d6b140303010100a10f03040d010204000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b01a10f411f',
				);
			});
			it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Westend to Polkadot', async () => {
			    const registry = new Registry('asset-hub-westend', {});
			    const isLiquidTokenTransfer = false;
			    const baseArgs: XcmBaseArgs = {
			        api: adjustedMockSystemApiV1011000,
			        direction: Direction.SystemToBridge as XcmDirection,
			        destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
			        assetIds: [
			            `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
			        ],
			        amounts: ['1000000000000'],
			        destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // location destChainId,
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
			        '0x6501041f0d03020109020304000201090200070010a5d4e80303010100a10f0300020109020303010100a10f03040d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
			    );
			});
		});

		describe('XCM V4', () => {
		    describe('RemoteReserve', () => {
		        it('Should correctly construct a transferAssetsUsingTypeAndThen tx from AssetHub Rococo to Ethereum Sepolia', async () => {
		            const registry = new Registry('asset-hub-rococo', {});
		            const isLiquidTokenTransfer = false;
		            const baseArgs: XcmBaseArgs = {
		                api: adjustedMockSystemApiV1011000,
		                direction: Direction.SystemToBridge as XcmDirection,
		                destAddr: '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
		                assetIds: [
		                    `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`, // Snowbridge Sepolia WETH location
		                ],
		                amounts: ['1000000000000'],
		                destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`, // location destChainId,
		                xcmVersion: 4,
		                specName: 'asset-hub-rococo',
		                registry,
		            };
		            const refTime = '1000';
		            const proofSize = '2000';
		            const paysWithFeeDest = '{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}';
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
		                api: adjustedMockSystemApiV1011000,
		                direction: Direction.SystemToBridge as XcmDirection,
		                destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		                assetIds: [
		                    `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // Polkadot location
		                ],
		                amounts: ['1000000000000'],
		                destChainId: `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`, // location destChainId,
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
		                '0x5d01041f0d040201090204040201090200070010a5d4e80304010100a10f04020109020304010100a10f04040d01020400010100f5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b01a10f411f',
		            );
		        });
		    });
		});
	});
});
