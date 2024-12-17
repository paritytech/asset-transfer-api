import { setupNetworks, testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { setTimeout } from 'timers/promises';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';

describe('Hydration <> Ethereum', () => {
	const ethereumNetworkGlobalConsensusLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`;
	let hydration: NetworkContext;
	let polkadotAssetHub: NetworkContext;
	let polkadotBridgeHub: NetworkContext;

	const { alice, alith } = testingPairs();

	beforeEach(async () => {
		const { hydration1, polkadotBridgeHub1, polkadotAssetHub1 } = await setupNetworks({
			hydration1: {
				endpoint: 'wss://rpc.hydradx.cloud',
				db: './db.sqlite',
				port: 8010,
			},
			polkadotBridgeHub1: {
				endpoint: 'wss://bridge-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8011,
			},
			polkadotAssetHub1: {
				endpoint: 'wss://asset-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8012,
			},
		});

		hydration = hydration1;
		polkadotBridgeHub = polkadotBridgeHub1;
		polkadotAssetHub = polkadotAssetHub1;
	}, 500000);

	afterEach(async () => {
		await hydration.teardown();
		await polkadotAssetHub.teardown();
		await polkadotBridgeHub.teardown();
	}, 500000);

	describe('XCM V3', () => {
		const xcmVersion = 3;

		test('Transfer Snowbridge WETH from Hydration to Ethereum', async () => {
			await hydration.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
					],
				},
				Tokens: {
					Accounts: [
						[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
						[[alice.address, 5], { free: '50000000000000000000000000' }], // DOT
						[[alice.address, 1000189], { free: '500000000000000000000' }], // Snowbridge WETH
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion, {
				registryType: 'NPM',
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

			const tx = await assetTransferApi.createTransferTransaction(
				ethereumNetworkGlobalConsensusLocation,
				alith.address,
				['DOT', 'WETH.snow'],
				['500000000000', '75000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();
			await polkadotAssetHub.dev.newBlock();

			const assetHubEvents = await polkadotAssetHub.api.query.system.events();

			const xcmMessageProcessed = assetHubEvents[assetHubEvents.length - 1];
			expect(xcmMessageProcessed.phase.toString()).toEqual('Finalization');
			expect(xcmMessageProcessed.event.method).toEqual('Processed');
			expect(xcmMessageProcessed.event.section).toEqual('messageQueue');

			await setTimeout(5000);
			await polkadotBridgeHub.dev.timeTravel(1);

			const bridgeHubEvents = await polkadotBridgeHub.api.query.system.events();
			const messageAcceptedEvent = bridgeHubEvents[bridgeHubEvents.length - 3];
			expect(messageAcceptedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageAcceptedEvent.event.method).toEqual('MessageAccepted');

			const messageCommittedEvent = bridgeHubEvents[bridgeHubEvents.length - 1];
			expect(messageCommittedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageCommittedEvent.event.method).toEqual('MessagesCommitted');
		}, 100000);
	});
	describe('XCM V4', () => {
		const xcmVersion = 4;

		test('Transfer Snowbridge WETH from Hydration to Ethereum', async () => {
			await hydration.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
					],
				},
				Tokens: {
					Accounts: [
						[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
						[[alice.address, 5], { free: '50000000000000000000000000' }], // DOT
						[[alice.address, 1000189], { free: '500000000000000000000' }], // Snowbridge WETH
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion, {
				registryType: 'NPM',
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

			const tx = await assetTransferApi.createTransferTransaction(
				ethereumNetworkGlobalConsensusLocation,
				alith.address,
				['DOT', 'WETH.snow'],
				['500000000000', '75000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();
			await polkadotAssetHub.dev.newBlock();

			const assetHubEvents = await polkadotAssetHub.api.query.system.events();

			const xcmMessageProcessed = assetHubEvents[assetHubEvents.length - 1];
			expect(xcmMessageProcessed.phase.toString()).toEqual('Finalization');
			expect(xcmMessageProcessed.event.method).toEqual('Processed');
			expect(xcmMessageProcessed.event.section).toEqual('messageQueue');

			await setTimeout(5000);
			await polkadotBridgeHub.dev.timeTravel(1);

			const bridgeHubEvents = await polkadotBridgeHub.api.query.system.events();
			const messageAcceptedEvent = bridgeHubEvents[bridgeHubEvents.length - 3];
			expect(messageAcceptedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageAcceptedEvent.event.method).toEqual('MessageAccepted');

			const messageCommittedEvent = bridgeHubEvents[bridgeHubEvents.length - 1];
			expect(messageCommittedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageCommittedEvent.event.method).toEqual('MessagesCommitted');
		}, 100000);
	});
});
