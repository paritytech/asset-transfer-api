import { setupNetworks, testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';

describe('Polkadot AssetHub <> Ethereum', () => {
	const snowbridgeWETHLocation = {
		parents: 2,
		interior: {
			X2: [
				{ GlobalConsensus: { Ethereum: { chainId: 1 } } },
				{ AccountKey20: { network: null, key: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' } },
			],
		},
	};
	let polkadotBridgeHub: NetworkContext;
	let polkadotAssetHub: NetworkContext;

	const { alice, alith } = testingPairs();

	beforeEach(async () => {
		const { polkadotBridgeHub1, polkadotAssetHub1 } = await setupNetworks({
			polkadotBridgeHub1: {
				endpoint: 'wss://bridge-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8003,
			},
			polkadotAssetHub1: {
				endpoint: 'wss://asset-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8004,
			},
		});

		polkadotBridgeHub = polkadotBridgeHub1;
		polkadotAssetHub = polkadotAssetHub1;
	}, 500000);

	afterEach(async () => {
		await polkadotBridgeHub.teardown();
		await polkadotAssetHub.teardown();
	}, 500000);

	describe('XCM V3', () => {
		const xcmVersion = 3;

		test('Snowbridge WETH From AssetHub to Ethereum', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					],
				},
				ForeignAssets: {
					Account: [[[snowbridgeWETHLocation, alice.address], { balance: 75000000000000 }]],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				`{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`,
				alith.address,
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}`,
				],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();
			await polkadotBridgeHub.dev.newBlock();

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

		test('Snowbridge WETH From AssetHub to Ethereum', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					],
				},
				ForeignAssets: {
					Account: [[[snowbridgeWETHLocation, alice.address], { balance: 75000000000000 }]],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				`{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`,
				alith.address,
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}`,
				],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();
			await polkadotBridgeHub.dev.newBlock();

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
